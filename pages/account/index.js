// index.js
import { confirm } from '../../utils/util';
import { getUser, longinOut } from '../../actions/user'
import { getwxloginJscode } from '../../actions/index'
import { emptyOrderListAction } from '../../actions/order'
import { host } from '../../config'
const { connect } = require('../../libs/wechat-weapp-redux.js')
var app = getApp();
const pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    //tabBar: app.globalData.tabBar,
    userInfo: {},
    login: false,
    greycolor: app.globalData.greycolor,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      color: this.data.shopInfo.theme,
      greycolor: app.globalData.greycolor,
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
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
    //获取用户信息
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme,
      color: this.data.shopInfo.theme,
      greycolor: app.globalData.greycolor
    })
    let userInfo = wx.getStorageSync('userInfo')
    let openid = wx.getStorageSync('openid')
    if (openid) {
      if (userInfo && userInfo.nickName) {
        this.setData({
          userInfo: userInfo,
          login: true
        })
      } else {
        this.setData({
          login: false,
          userInfo: Object.assign(userInfo, { avatarUrl: '../../images/men.png' })
        })
        this.loginSys();
      }

    } else {
      this.loginSys();
      this.setData({
        login: false,
        userInfo: Object.assign(userInfo, { avatarUrl: '../../images/men.png' })
      })
    }
  },
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/index'
    })
  },
  //用户登陆
  loginSys() {
    getUser({
      data: {},
      success: (res) => {
        if (res.result) {
          wx.setStorageSync("userInfo", Object.assign({}, this.data.userInfo, res.result))
          this.setData({
            userInfo: res.result,
            login: true
          })
        }
      },
      error: (res) => {

      }
    })
  },
  shopPhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfo.servicePhone
    })
  },
  //客服热线
  customer() {
    wx.makePhoneCall({
      phoneNumber: '020-22969999‬'
    })
  },
  //用户退出
  loginOut() {
    let that = this;
    confirm({
      content: "确定退出您的账号？",
      ok: () => {
        emptyOrderListAction({}, this)
        wx.setStorageSync('userInfo', Object.assign(that.data.userInfo, { nickName: "", avatarUrl: '../../images/men.png' }));
        this.setData({
          userInfo: Object.assign(that.data.userInfo, { nickName: "", avatarUrl: '../../images/men.png' }),
          login: false
        })
        let openid = wx.getStorageSync('openid')
        longinOut({
          data: { openId: openid },
          success: (res) => {
            if (res.errorCode == 0) {
              wx.removeStorageSync('token')
              wx.removeStorageSync('uid')
              wx.removeStorageSync('openid')
            }
          }

        });
      }
    })

  },

  /**
   * 跳转到全部订单
   */
  nextPage: function (e) {
    var type = e.currentTarget.dataset.nextKey
    wx.navigateTo({
      url: '/pages/order/order?type=' + type
    })
  }
}
function mapStateToProps(state) {
  return {
    shopInfo: state.shopInfo,
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)