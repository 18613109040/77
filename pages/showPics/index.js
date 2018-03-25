// pages/showPics/index.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    windowHeight: "",
    windowWidth: "",
    currentIndex:0,
    imgUrls: [],
    length:0,
    leftShow:false,
    rightShow:false,
    indicatorDots:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
    wx.getStorage({
      key: 'shopinfo',
      success: (res) =>  {
        console.log(res)
        this.setData({
           imgUrls: res.data.images, 
           length: res.data.images.length,
           leftShow: options.index > 0,
            rightShow: res.data.images.length>0,
            currentIndex:options.index
        })
      },
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
  bindchange(e){
    this.setData({
      leftShow:  e.detail.current>0,
      rightShow: this.data.imgUrls.length > e.detail.current+1
    })
    
    
  }
})