import { getProblem } from '../../../actions/user'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: app.globalData.color,
    greycolor: app.globalData.greycolor
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let options = {
      id: 2
    }
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
    getProblem({
      data: options,
      success: (res) => {
        this.setData({
          data: res.result
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onNextPage: function (e) {
    let { id ,title} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/problem/list/index?id=${id}&title=${title}`
    })
  },

})