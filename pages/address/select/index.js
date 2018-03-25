import { orderAdressList, changeAddress } from '../../../actions/order'
const { connect } = require('../../../libs/wechat-weapp-redux.js')
let app = getApp()
const pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    adressList: [],
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    serverImg: app.globalData.serverImg,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    })
    this.getaddresbyweb()
  },
  //选中地址
  changeAdress(e) {
    let { id, available } = e.currentTarget.dataset;
    if (this.data.shopPay.selected == 2) {
      this.dispatch(changeAddress(this.data.adressList.find(item => item.id == id)))
      wx.navigateBack();
    }
    else if (available) {
      this.dispatch(changeAddress(this.data.adressList.find(item => item.id == id)))
      wx.navigateBack();
    }

  },
  getaddresbyweb() {
    //获取收货地址
    this.dispatch(orderAdressList({
      data: {
        memberId: 1,
        shopId: this.data.shopInfo.id
      },
      success: (res) => {
        this.setData({
          adressList: res.result
        })
      }
    }))

  },
}
function mapStateToProps(state) {
  const { shopPay } = state.orderSubmitData;
  return {
    shopInfo: state.shopInfo,
    shopPay: shopPay
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)