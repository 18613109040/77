// index.js
import { register, sendCode,registerXcxPhone } from '../../actions/user'
import { host } from '../../config.js'
let ov = null ;
let app = getApp()
let query ={};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    verifyCode:"",
    name:"获取验证码",
    disabled:false,
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options;
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //微信一键登录
  getPhoneNumber: function (e) {
    registerXcxPhone({
      data:{
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        thridSessionKey: wx.getStorageSync("thridSessionKey")
      },
      success: (response)=>{
        if (response.errorCode == 0){
          wx.setStorageSync("openid", response.result.openid);
          wx.setStorageSync("token", response.result.token);
          wx.setStorageSync("uid", response.result.uid);
          wx.switchTab({
            url: '/pages/account/index'
          })
        }else{
         
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    })
    if (wx.getStorageSync("openid")){

    }else{
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: `${host}/wechat/wxlogin_jscode`,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: res.code,
                shopId: 0
              },
              success: (response) => {
                if (response.data.result) {
                  wx.setStorageSync("openid", response.data.result.openid);
                  wx.setStorageSync("token", response.data.result.token);
                  wx.setStorageSync("uid", response.data.result.uid);
                  wx.setStorageSync("thridSessionKey", response.data.result.thridSessionKey);
                }
              },
              error: (res) => {
                console.debug(res)
              }
            })
          }
        }
      }) 
    }
    
  },
  changeImput(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //验证吗
  changeverifyCode(e){
    this.setData({
      verifyCode: e.detail.value
    })
  },
  //绑定手机号
  bindCode(){
    let openid = wx.getStorageSync("openid");
    if (openid){
      register({
        data: {
          phone: this.data.phone,
          verifyCode: this.data.verifyCode,
          openId: openid
        },
        success:(res)=>{
          wx.setStorageSync("token", res.result.token);
          wx.setStorageSync("uid", res.result.uid);
          console.dir(query)
          if(query.url){
            wx.redirectTo({
              url: `${query.url}?lat=${query.lat}&lng=${query.lng}`
            })
          }else{
            wx.switchTab({
              url: '/pages/account/index'
            })
          }
          
        }
      })
    }else{
      

    }
    
  },
  onUnload(){
    if (this.data.ov)
     clearInterval(this.ov);
  },
  //获取手机验证码
  getCode(){
    if (!this.data.phone){
        return ;
    }
    this.setData({
      disabled:true
    })
    let time = 60;
    ov =  setInterval((res)=>{
      if(time==1){
        this.setData({
          name: "获取验证码",
          disabled: false
        })
        clearInterval(ov);
        return;
      }
      time--
      this.setData({
        name: `${time}秒`
      })
    },1000)
    sendCode({
      data:{
        phone: this.data.phone
      },
      success:(res)=>{

        console.dir(res);
      }
    })
  
   // this.data.phone
  },
  nextPage:function(e){
    wx.navigateTo({
      url: '/pages/register/index',
    })
  }
})