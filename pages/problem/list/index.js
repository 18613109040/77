// pages/problem/list/index.js
import { listForPage } from '../../../actions/user'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAllPage: 1,
    list:[],
    color: app.globalData.color,
    greycolor: app.globalData.greycolor
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      color: app.globalData.color,
      greycolor: app.globalData.greycolor
    })
    
    wx.setNavigationBarTitle({
      title: options.title
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
    this.getData()
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
  /**
  * 下拉加载数据
  */
  scrollLower() {
    if (this.data.load) 
      return;
    this.getData()
    

  },
  getData(){
    listForPage({
      data: {
        "categoryId":this.data.id,
        "page.pageSize": 10,
        "page.currentPage": this.data.currentAllPage
      },
      success: (res) => {
        if (res.result.totalPage <= this.data.currentAllPage) {
          this.setData({
            load: true,
          })
        } else {
          this.setData({
            load: false,
          })
        }
        for (let i = 0; i < res.result.data.length; i++){
          res.result.data[i].content = res.result.data[i].content?JSON.parse(res.result.data[i].content):[]
        }

        this.setData({
          list: this.data.list.concat(res.result.data),
          currentAllPage: this.data.currentAllPage + 1
        })
      }
    })
  },
  onNextPage: function (e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/problem/details/index?id=${id}`
    })
  },
})