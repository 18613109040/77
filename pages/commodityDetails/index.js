import {goodsListComment} from '../../actions/classification'
import { shopDetailsAction} from '../../actions/goods'
import { getCarouselList } from '../../actions/home'
const { connect } = require('../../libs/wechat-weapp-redux.js')
import { addShopCartAction } from '../../actions/shopcart'
import { getShopDetail } from '../../actions/home'
import { getShopInfoAction } from '../../actions/shop'
import { addSubmitShop } from '../../actions/order'
let query = {}
let app = getApp()
const pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    windowWidth:"",
    modelShow:false,
    theme: "#FF004C",
    greycolor: app.globalData.greycolor,
    commentData:{},
    shopDetailsinit:{} //wx组件存在bug 暂时 解决方案
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options;
    if (options&&options.shopid){
      this.checkShop(options.shopid)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    
    })
    // new app.ToastPannel();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    //获取评价
    goodsListComment({
      data:{
        "page.pageSize":1,
        "page.currentPage":1,
        "goodsId": query.id
      },
      success:(res)=>{
        if (res.result && res.result.data.length>0){
          res.result.data[0].createDt = res.result.data[0].createDt.split(" ")[0]
          
        }
        this.setData({
          commentData: res.result
        })
      }
    })
    //获取商品详情
    shopDetailsAction({
      id: query.id,
      data:{}
    },this)
    console.dir(this.data.shopInfo)
    const { isRest } = this.data.shopInfo;
    if (isRest){
      wx.showToast({
        title: '该店已打烊',
        icon:"none",
        duration: 3000
      })
    }
  },
  checkShop(shopid) {
    //获取店铺详情
    app.getCurrentAddress((res) => {
      let latitude = res.location.lat;
      let longitude = res.location.lng;
      getShopDetail({
        data: {
          shopId: shopid,
          longitude: longitude,
          latitude: latitude,
        },
        success: (res) => {
          if (res.result.distance > 1000) {
            res.result.distance = (res.result.distance / 1000).toFixed(2) + "公里"
          } else {
            res.result.distance = res.result.distance + "米"
          }
          res.result.duration = Math.ceil((res.result.duration / 60))
          wx.setStorage({
            key: "shopinfo",
            data: res.result
          })
          //保存店铺信息
          getShopInfoAction(res.result, this);
        }
      })
    })
  },
  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按
    }
    return {
      title: this.data.shopInfo.name,
      path: `/pages/commodityDetails/index?shopid=${this.data.shopInfo.id}&id=${query.id}`,
      success: function (res) {
        // 转发成功
        console.debug(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  gotoComment(){
    wx.navigateTo({
      url: `/pages/shopComment/index?id=${query.id}`
    })
  },
  //去购物车
  gotoCart(e) {
    if (this.data.shopcart.length > 0) {
      this.setData({
        modelShow: true
      })
    } else {
     // this.show("请添加商品");
    }

  },
  //跳转订单界面
  goPay(){
    let openid = wx.getStorageSync('openid');
    let token = wx.getStorageSync('token');
    if (openid && token) {
      let filterData = this.data.shopcart.filter(item => item.id === this.data.shopDetails.id);
      if (this.data.shopDetails.multiKinds == 1) {
        if (filterData.length > 0) {
          this.dispatch(addSubmitShop(filterData))
          wx.navigateTo({
            url: `/pages/ordersubmit/index?id=${query.id}`
          })
        } else {
          this.addCartBtn();
        }
      } else {
        if (this.data.shopDetails.number < 1) {
          this.addCartBtn();
        }
        this.dispatch(addSubmitShop([Object.assign({}, this.data.shopDetails, { number: this.data.shopDetails.number })]))
        wx.navigateTo({
          url: `/pages/ordersubmit/index?id=${query.id}`
        })
      }

    } else {
      wx.switchTab({
        url: '/pages/account/index'
      })
    }
   
  },
  addCartBtn(){
    
      if (this.data.shopDetails.multiKinds == 0) {
        addShopCartAction(this.data.shopDetails,this)
      } else {
        app.event.emit('addShopCartEvent', this.data.shopDetails)
      }
    
  }
}
function mapStateToProps(state) {
  let number = 0;
  let allmoney = 0
  state.shopcart.map(item => {
    number += item.number
    if (item.discountFlag == true) {
      if (item.number <= item.limitNum) {
        allmoney += item.discountPrice * item.number
      } else {
        allmoney += item.discountPrice * item.limitNum;
        allmoney += (item.number - item.limitNum) * item.price;
      }
    } else {
      allmoney += item.price * item.number
    }
  })
  let tem = state.shopcart.filter(item => item.id === state.shopDetails.id && item.multiKinds == 0)
  if (tem.length > 0) {
    state.shopDetails.number = tem[0].number
  } else {
    state.shopDetails.number = 0
  }
  return {
    shopcart: state.shopcart,
    allnumber: number,
    allmoney: parseFloat(allmoney).toFixed(2) ,
    shopDetails: state.shopDetails || {},
    shopInfo: state.shopInfo,
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)