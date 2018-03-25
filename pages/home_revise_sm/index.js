//index.js
import {  getKeyAdress } from '../../utils/util'
const { connect } = require('../../libs/wechat-weapp-redux.js')
import { getListShopByL, listShopType, getShopgb,getBusinessTypes} from '../../actions/index'
import { getUserInfo, getOpenid } from '../../actions/user'
import { getShopInfoAction, getShopInfoByIdAction} from '../../actions/shop'
import { clearShopCartAction} from '../../actions/shopcart'
import { emptyCategoryListAction, emptyCategoryGoodsAction} from '../../actions/classification'
import { getShopDetail} from '../../actions/home'
//获取应用实例
let app = getApp()
let query = {};
let queryShopParams = {}
const pageConfig = {
  data: {
    address: "", //地址
    result: [],//保存补完与提示
    resultPage: 0,//0 默认 1 没结果
    selectindex: 0, //默认选中店铺
    showLetter: "",
    cityList: [],
    searchlg: {
      location: {
        lng: "",
        lat: ""
      }
    },
    imagebg:"",
    windowHeight: "",
    isShowLetter: false,
    scrollTop: 0,
    city: "广州",
    cityselect: false,
    serverImg: app.globalData.serverImg,
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    adressData: [],
    filterindex: 0,
    shopTypeData: [],
    shopTypeindex: -1,
    shopName: "",
    showType: false,
    shopType: "",
    sortType: "",
    shopBgList:[], // 轮播图
    BusinessList : [], // 店铺类型
  },
  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按
    }
    return {
      title: "77秒",
      path: `/pages/index/index`,
      success: function (res) {
        // 转发成功
        console.debug(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:options.name||'选择店铺'
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    
    // app.event.on('changeAddress', this.changeAddress, this);
    // 生命周期函数--监听页面加载
    wx.showLoading({
      title: "定位中"
    })
    
    app.getCurrentAddress((res) => {
      wx.hideLoading()
      wx.setStorageSync("userInfo", res)
      var latitude = res.location.lat;
      var longitude = res.location.lng;
      this.setData({
        city: res.city,
        userinfo: res,
        address: res.title,
        searchlg: {
          location: {
            lat: res.location.lat,
            lng: res.location.lng
          }
        }
      })
      let optins = {
        'page.currentPage':1,
        'page.pageSize':15,
        longitude: longitude,
        shopName: this.data.shopName,
        latitude: latitude,//'113.244140',
        shopType: options.type,
        sortType: this.data.sortType,
        myLongitude: longitude,//'23.397570',
        myLatitude: latitude//'113.244140'
      }
      this.getShopListByParams(optins)
    })


  },
  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按
    }
    return {
      title: '思埠便利店',
      path: `/pages/index/index`,
      success: function (res) {
        // 转发成功
        console.debug(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  // onUnload: function () {
  //   //app.event.off()
  //   app.event.off('changeAddress')
  //   app.event.off('changeAddress', this.changeAddress)
  // },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
    // 正在请求接口
    if(this.data.isLoading) return
    // 店铺总页数
    let page = this.data.shopTotalPage
    if(queryShopParams['page.currentPage']>=page) return
    queryShopParams['page.currentPage']++
    this.data.isLoading = true
    this.getShopListByParams(queryShopParams)
  },
  //进入店铺
  redirectToHome(e){
    let { name,id } = e.currentTarget.dataset;
    app.globalData.color = name.theme ? name.theme : "#FF004C";
    wx.removeStorageSync('cart');
    clearShopCartAction({}, this);
    emptyCategoryListAction({}, this);
    emptyCategoryGoodsAction({}, this);
    
    this.dispatch(getShopInfoByIdAction({
      shopId: name.id,
      longitude: this.data.userinfo.location.lng,
      latitude: this.data.userinfo.location.lat
    }, (res) => {
      wx.setStorageSync("shopinfo", res.result)
      if (!id) {
        wx.switchTab({
          url: '/pages/home/index'
        })
      } else {
        wx.navigateTo({
          url: `/pages/commodityDetails/index?id=${id}`
        })
      }
    }))
  },
  getShopListByParams(optins){
    this.data.isLoading=true
    queryShopParams = optins
    getListShopByL({
      data: optins,
      success:this.getShopListCallback
    })
  },
  // 获取店铺列表
  getShopListCallback({result,errorCode}){
    let {data,totalCount,totalPage} = result
    data.map(item => {
      if (item.distance > 1000) {
        item.distance = (item.distance / 1000).toFixed(2) + "公里"

      } else {
        item.distance = item.distance + "米"
      }
      item.duration = Math.ceil((item.duration / 60))
    })
    let {adressData} = this.data
    let list = [...adressData,...data]
    list = list.map(item=>{
      item.averageScore = 5.8
      return item
    })
    this.setData({
      adressData: list,
      resultPage: 0
    })
    this.data.isLoading = false
    this.data.shopTotalPage  = totalPage
    this.data.shopTotalCount = totalCount
  },
  // 商品详情
  onGoodsDetail(e){
    let {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  }
}

function mapStateToProps(state) {
  return {
   
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)