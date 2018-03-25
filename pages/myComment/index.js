// pages/myComment/index.js
import { getMyCommentList } from '../../actions/comment'
var app = getApp();
const { connect } = require('../../libs/wechat-weapp-redux.js')
const pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    greycolor: app.globalData.greycolor,
    currentPage:1,
    commentList:[],
    toalPage:0,
    load:false,
    windowHeight:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      greycolor: app.globalData.greycolor,
    })
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
    })
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo,
      toalPage: 0,
      load: false,
      currentPage: 1,
      commentList: []
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  clickTitle(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  },
  scrollLower(){
    if (this.data.load) {
      return;
    } else {
      this.getData(this.data.itemlistid)
    }
  },
  scroll(e){
    console.dir(e.detail.scrollTop)
  },
  getData(){
    this.setData({
      load: true
    })
    getMyCommentList({
      data: {
        'page.pageSize': 10,
        'page.currentPage': this.data.currentPage
      },
      success: (res) => {
        res.result.data.map(item => {
          item.createDt = item.createDt.split(' ')[0]
        })
        if (res.result.totalPage <= this.data.currentPage) {
          this.setData({
            load: true,
            toalPage: res.result.totalCount,
            commentList: this.data.commentList.concat(res.result.data),
            currentPage: this.data.currentPage + 1

          })
        } else {
          this.setData({
            load: false,
            toalPage: res.result.totalCount,
            commentList: this.data.commentList.concat(res.result.data),
            currentPage: this.data.currentPage + 1

          })
        }
      }
    })
  }
 
}
function mapStateToProps(state) {
  return {
    shopInfo: state.shopInfo
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)