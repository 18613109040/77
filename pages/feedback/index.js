import { alert } from '../../utils/util'
import WxValidate from '../../utils/WxValidate'
import { addReport } from '../../actions/user'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    descript: "",
    phone: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
   
    this.initValidate();
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

  initValidate() {
    this.validate = new WxValidate({
      descript: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      }
    }, {
        descript: {
          required: '请输入您的宝贵意见'
        },
        phone: {
          required: '请输入手机号',
          tel: '请输入有效手机号码'
        }
        
      })
  },
  formSubmit: function (e) {
    if (!this.validate.checkForm(e)) {
      const error = this.validate.errorList[0]
      return alert(error.msg)
    }
    let option = {
      content: e.detail.value.descript,
      phone: e.detail.value.phone,
      type:1
    }
    addReport({
      data: option,
      success: (res) => {
        wx.showToast({
          title: res.errorMsg,
          icon: 'success',
          duration: 2000
        })
        if(res.errorCode==0)
          wx.navigateBack()
      },
      error: (res) => {
        
      }

    })

  }
})