import { host } from '../../config'
import { eidtUser,decodeUserInfo} from '../../actions/user'
import {alert} from '../../utils/util'
import weCropper from '../../components/weCropper/weCropper.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    actionSheetItems: ['相机拍摄', '相册'],
    userInfo: {},
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    show:false,
    cropperOpt: {
      id: 'cropper',
      width:"",
      height:"",
      scale: 2.8,
      zoom:8,
      cut: {
        x: (wx.getSystemInfoSync().windowWidth - 200) / 2,
        y: (wx.getSystemInfoSync().windowHeight - 200) / 2,
        width: 200,
        height: 200
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          cropperOpt: Object.assign({}, this.data.cropperOpt, { height: res.windowHeight-80, width: res.windowWidth})
        })
        new weCropper(Object.assign({}, this.data.cropperOpt, { height: res.windowHeight-80, width: res.windowWidth }))
          .on('ready', function (ctx) {
            console.log(`wecropper is ready for work!`)
          })
          .on('beforeImageLoad', (ctx) => {
            console.log(`before picture loaded, i can do something`)
            console.log(`current canvas context:`, ctx)
            wx.showToast({
              title: '上传中',
              icon: 'loading',
              duration: 20000
            })
          })
          .on('imageLoad', (ctx) => {
            console.log(`picture loaded`)
            console.log(`current canvas context:`, ctx)
            wx.hideToast()
          })
      }
    })
   

    
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid')
    this.wecropper.getCropperImage((src) => {
      if (src) {
        wx.uploadFile({
            url: host +"/api/upload/photoUpload",
            filePath: src,
            name: 'file',
            header:{
              "content-type":"multipart/form-data",
              "Shop-Token": token,
              "Shop-UID": uid
            },
            formData: {
              'file': src
            },
            success:  (res)=> {
              console.dir(res)
              this.setData({
                userInfo: Object.assign(this.data.userInfo, { avatarUrl: JSON.parse(res.data).result}),
                show:false
              })
            }, fail:(red)=>{
              console.dir(res)
            }
          })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:(res) =>{
        const src = res.tempFilePaths[0]
        self.wecropper.pushOrign(src)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  actionSheetChange() {
    this.setData({
      actionSheetHidden: true
    })
  },
  //获取微信信息
  getWxUserINfo(){
    wx.getUserInfo({
      success:  (res)=> {
        let userInfo = res.userInfo
        eidtUser({
          data: {
            nickName: userInfo.nickName,
            gender: userInfo.gender-1,
            avatarUrl: userInfo.avatarUrl,
            city: userInfo.city
          },
          success: (res) => {
            wx.setStorageSync('userInfo',
              Object.assign(this.data.userInfo, { avatarUrl: userInfo.avatarUrl, nickName: userInfo.nickName, gender: userInfo.gender }))
            wx.navigateBack();
          }

        })
      }
    })
  },
  onClickImage() {
    this.setData({
      actionSheetHidden: false,
    })
  },
  bindTap(e) {
    let { name } = e.currentTarget.dataset;
    let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid')
    if (name == "相机拍摄") {
      let uploadTask= wx.chooseImage({
        count: 1, // 默认9
       // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success:  (res)=> {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          
          this.wecropper.pushOrign(tempFilePaths[0])
          this.setData({
            show:true
          })
          // wx.uploadFile({
          //   url: host +"/api/upload/photoUpload",
          //   filePath: tempFilePaths[0],
          //   name: 'file',
          //   header:{
          //     "content-type":"multipart/form-data",
          //     "Shop-Token": token,
          //     "Shop-UID": uid
          //   },
          //   formData: {
          //     'file': tempFilePaths[0]
          //   },
          //   success:  (res)=> {
          //     this.setData({
          //       userInfo: Object.assign(this.data.userInfo, { avatarUrl: JSON.parse(res.data).result})
          //     })
          //   }, fail:(red)=>{
          //     console.dir(res)
          //   }
          // })
        }
      })

      
    } else {
      let uploadTask= wx.chooseImage({
        count: 1, // 默认9
      //  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res)=> {
          console.dir(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          this.setData({
            show: true
          })
          this.wecropper.pushOrign(tempFilePaths[0])
          // wx.uploadFile({
          //   url: host + "/api/upload/photoUpload", 
          //   filePath: tempFilePaths[0],
          //   name: 'file',
          //   header: {
          //     "content-type": "multipart/form-data",
          //     "Shop-Token": token,
          //     "Shop-UID": uid
          //   },
          //   formData: {
          //     'file': tempFilePaths[0]
          //   },
          //   success:  (res)=>{
          //     this.setData({
          //       userInfo: Object.assign(this.data.userInfo, { avatarUrl: JSON.parse(res.data).result })
          //     })       
          //   },fail: (red) => {
          //     console.dir(res)
          //   }
          // })
        }
      })

      
    }
    this.setData({
      actionSheetHidden: true
    })
  },
  //保存用户信息
  formSubmit(e){

    console.dir(e.detail.value);
    if (!e.detail.value.nickName){
      alert("请填写昵称")
      return ;
    }
  
    eidtUser({
      data:{
        nickName: e.detail.value.nickName,
        gender: e.detail.value.gender,
        avatarUrl: this.data.userInfo.avatarUrl,
        // country: this.data.userInfo,
        // province: this.data.userInfo.city,
        city: this.data.userInfo.city

      },
      success:(res)=>{
        alert("修改用户信息成功")
        wx.setStorageSync('userInfo',
          Object.assign(this.data.userInfo, { avatarUrl: this.data.userInfo.avatarUrl,nickName: e.detail.value.nickName, gender: e.detail.value.gender }))
        wx.navigateBack();
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

 
})