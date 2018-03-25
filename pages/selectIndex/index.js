// pages/selectIndex/index.js
import { alert, getKeyAdress, getSearchAdress} from '../../utils/util'
import { getListShopByL, listShopType } from '../../actions/index'
import { getListAddress } from '../../actions/address'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: wx.getStorageSync('userInfo').city || '广州',
    addressT: "", //地址
    result: [],//保存补完与提示
    windowHeight: "",
    load:false,
    pagesize:1,
    options:{},
    adressData:[],
    url: "",
    userinfo: wx.getStorageSync('userInfo'),
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    serverImg: app.globalData.serverImg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.event.on('changecity', this.cityChange, this);
    this.setData({
      options: options
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
  cityChange(city) {
    this.setData({
      city: city
    })
  },
  cityClick: function (e) {
    // wx.navigateTo({
    //   url: '/pages/changecity/index'
    // })
  },
  bindAddressInput: function (e) {
    let value = e.detail.value;
    console.dir(value)
    if(!value){
      this.setData({
        result: []
      })
    }else{
      let optins = {
        value: value,
        region: this.data.city
      }
      getKeyAdress(optins, (res) => {
        this.setData({
          result: res.data
        })
      })
    }
    
  },
  clickAdress(e){
    let { name } = e.currentTarget.dataset;
    app.event.emit('changeAddress', name)
    wx.navigateBack();
  },
  //点击搜索结果
  clickSuchAdress(e) {
    let { name } = e.currentTarget.dataset;
    app.event.emit('changeAddress', {
      address: name.address,
      lat: name.location.lat,
      lng: name.location.lng,
      title: name.title
    })
    wx.navigateBack();
  },
 
  currentAdre() {
    this.setData({
      adressData: []
    })
    this.getData({
      latitude: wx.getStorageSync('userInfo').location.lat,
      longitude: wx.getStorageSync('userInfo').location.lng,
      key: "大厦"
    })
  },
  getData(options) {
    // this.setData({
    //   load: true
    // })
    getSearchAdress({
      location: {
        lat: options.latitude,
        lng: options.longitude
      },
      key: options.key,
      pageIndex: this.data.pagesize
    }, (res) => {
  
      this.setData({
        adressData: res.data, //[].concat(this.data.adressData, res.data),
        pagesize: 1 //this.data.pagesize + 1
      })
     
      // if (Math.ceil(res.count / 10) > this.data.pagesize) {
      //   this.setData({
      //     load: false
      //   })
      // } else {
      //   this.setData({
      //     load: true
      //   })
      // }
    })
  },
  scrollLower() {
    if (this.data.load)
      return;
    this.getData({
      latitude: wx.getStorageSync('userInfo').location.lat,
      longitude: wx.getStorageSync('userInfo').location.lng,
      key: "大厦"
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
    this.getData({
      latitude: this.data.options.lat,
      longitude: this.data.options.lng,
      key: "大厦"
    })
    this.setData({
      url: wx.getStorageSync('token') ? "/pages/address/add/index" : `/pages/login/index?url=/pages/selectIndex/index&lat=${this.data.options.lat}&lng=${this.data.options.lng}`
    })
    if (wx.getStorageSync('token')){
      let option = {
        "page.pageSize": 100,
        "page.currentPage": 1,
        "memberId": 1
      }

      getListAddress({
        data: option,
        success: (res) => {
          res.result.data.map(item => {
            item.title = item.title;
            item.address = item.detail;
          })
          this.setData({
            adressList: res.result.data
          })
        }
      })
    }else{
     
    }
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
    app.event.off('changecity')
    app.event.off('changecity', this.cityChange)
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