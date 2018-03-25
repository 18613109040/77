// order.js
import { alert, getKeyAdress, getSearchAdress } from '../../../utils/util'
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    controls: [{
      id: 1,
      iconPath: '../../../images/dingwei-t.png',
      position: {
        left: 10,
        top:200 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    lat:"",
    long:"",
    adressData:[],
    pagesize:1,
    location:{},
    load:false,
    city: "",
    result:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.dir(option)
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
      city: option.city
    })
  },
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
      backgroundColor: app.globalData.color
    })
    wx.getLocation({
      type: 'gcj02',
      success: (resd) => {
        this.getData({
          latitude: resd.latitude,
          longitude: resd.longitude,
          key: "大厦"
        })
        this.setData({
          location: {
            latitude: resd.latitude,
            longitude: resd.longitude
          },
          lat: resd.latitude,
          long: resd.longitude,
          markers: [{
            iconPath: "../../../images/biaoji.png",
            id: 0,
            latitude: resd.latitude,
            longitude: resd.longitude,
            width: 30,
            height: 30
          }]
        })
        this.mapCtx = wx.createMapContext('myMap');
       
      }
    }) 

    
  },
  controltap(){
    this.mapCtx.moveToLocation()
  },
  clickSuchAdress(e){
    let { name } = e.currentTarget.dataset;
    if (name.ad_info){
      Object.assign( name, {
        adcode: name.ad_info.adcode,
        city: name.ad_info.city,
        district: name.ad_info.district,
        province: name.ad_info.province
      })
    }
    app.event.emit('changeAdress', name)
    wx.navigateBack();
  },
  bindregionchange(e){
    if (e.type == 'end'){
      this.mapCtx.getCenterLocation({
        success: (res) => {
          this.mapCtx.translateMarker({
            markerId: 0,
            autoRotate: false,
            duration: 1000,
            destination: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            animationEnd: () => {
              this.setData({
                adressData: [],
                pagesize: 1,
                location: {},
                load: false,
                lat: res.latitude,
                long: res.longitude
              })
              this.getData({
                latitude: res.latitude,
                longitude: res.longitude,
                key: "大厦"
              })
            }
          })
        }
      })
    } 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    

  },
  getCenterLocation(){
    this.mapCtx.moveToLocation();
   
  },
  scrollLower(){
    if (this.data.load)
      return;
    this.getData({
      latitude: this.data.lat,
      longitude: this.data.long,
      key: "大厦"
    })
  },
  bindAddressInput(e) {
    let value = e.detail.value;
    let optins = {
      value: value,
      region: this.data.city
    }
    getKeyAdress(optins, (res) => {
      this.setData({
        result: res.data
      })
    })
  },
  getData(options){
    this.setData({
      load: true
    })
    getSearchAdress({
      location: {
        lat: options.latitude,
        lng: options.longitude
      },
      key: options.key,
      pageIndex: this.data.pagesize
    }, (res) => {
      this.setData({
        adressData: [].concat(this.data.adressData,res.data),
        pagesize: this.data.pagesize+1
      })
      console.dir(Math.ceil(res.count / 10))
      console.dir(this.data.pagesize)
      if (Math.ceil(res.count / 10) > this.data.pagesize){
        this.setData({
          load:false
        })
      }else{
        this.setData({
          load: true
        })
      }
    })
  }
})