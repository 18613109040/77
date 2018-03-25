const { Provider } = require('./libs/wechat-weapp-redux.js');
const configureStore = require('./store/configureStore.js'); 
import { Event } from './utils/event'
import { ToastPannel } from './template/toast/index'
import { getCurrentAddress, getCurrentLoaction} from './utils/util';
App(Provider(configureStore())({
  event: new Event(),
  ToastPannel,
  onLaunch: function () {
    wx.removeStorageSync('cart')
  
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getCurrentLoaction(cb){
    getCurrentLoaction(loaction=>{
      cb(loaction)
    })
  },
  getCurrentAddress(cb) {
    getCurrentAddress(address => {
      cb(address)
    })
  },
  globalData: {
    userInfo: null,
    color: '#ff004c',//'#00CD00',//'#00CD00', //#FF004C',//',//"",
    greycolor: "#ddd",
    serverImg: "/images",
  }
}))