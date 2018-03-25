// pages/specialGoods/index.js
import { getSpecialGoods } from '../../actions/home'
const { connect } = require('../../libs/wechat-weapp-redux.js')
let app = getApp()
const pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    theme: "#FF004C",
    windowHeight:"",
    windowWidth:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     color: app.globalData.color,
     greycolor: app.globalData.greycolor,
   })
   getSpecialGoods({
     data: {
       id: options.id
     }
   }, this)
   wx.getSystemInfo({
     success: (res) => {
       this.setData({
         windowHeight: res.windowHeight,
         windowWidth: res.windowWidth
       })
     }
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    
  },
  //去购物车
  gotoCart(e) {
    if (this.data.shopcart.length > 0) {
      this.setData({
        modelShow: true
      })
    } else {
      this.show("请添加商品");
    }

  },
  //跳转商品详情
  toDetails(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  }
}
function mapStateToProps(state) {
  //统计购物车数量 & 总价
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
  if (state.specialGoods.goods.length > 0) {
    state.specialGoods.goods.map(item => {
      let d = state.shopcart.filter(ix => item.multiKinds == 0 && ix.id === item.id)
      if (d.length > 0) {
        item.number = d[0].number
      } else {
        item.number = 0
      }
    })
  }
  //分类列表控制
  let classData = state.classification;
  classData.map((item, index) => {
    let d = state.shopcart.filter(ix => ix.categoryId1 === item.id)
    if (d.length > 0) {
      let number1 = 0
      d.map(i => {
        number1 += i.number
      })
      item.number = number1
    } else {
      item.number = 0;
    }
    let da = item.childs || [];
    da.map((ite) => {
      if (state.shopcart.filter(ix => ix.categoryId2 === ite.id).length > 0) {
        ite.check = true
      } else {
        ite.check = false
      }
    })
  })
  return {
    shopcart: state.shopcart,
    allnumber: number,
    shopInfo: state.shopInfo,
    specialGoods: state.specialGoods,
    allmoney: parseFloat(allmoney).toFixed(2)
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)