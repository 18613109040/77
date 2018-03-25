// index.js
let query = {}
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData:{

    },
    color: app.globalData.color,
    greycolor: app.globalData.greycolor
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options;
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

    this.setData({
      orderData: query
    })
    wx.setNavigationBarTitle({
      title: '下单成功'
    })
    // 不判断支付状态，到店自提和送货上门没有支付状态，提示下单成功
    // if (query.payType === '1'){
    //   wx.setNavigationBarTitle({
    //     title: '订单支付成功'
    //   })
    // }else{
    //   wx.setNavigationBarTitle({
    //     title: '订单未支付'
    //   })
    // }
 
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
  
  }
})