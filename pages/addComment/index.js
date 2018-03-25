import { getOrderOetails } from '../../actions/order';
import { postComment, getCommentDetail, getCommentEidt} from '../../actions/comment'
import {  getShopDetail } from '../../actions/home'
import { host } from '../../config'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAnonymous:1,
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    orderid:"",
    orderList:{},
    goods:[],
    sorce:0,
    commentText:"",
    actionSheetHidden: true,
    actionSheetItems: ['相机拍摄', '相册'],
    image:[],
    shopinfo:{},
    type:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderid = options.id;
    let type = options.type;
    console.dir(options)
    this.setData({
      orderid: orderid,
      type: type?type:""
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //提交
  submitComment(){
    if (this.data.sorce == 0 || this.data.goods.filter(item => item.evaluationStatus==-1).length>0){
      this.show("请对商品发表评价");
      return ;
    }
    let goodsComments = [];
    let datap={};
    
    let obj ={}
    for (let i = 1; i <= this.data.image.length;i++){
      obj[`commentImg${i}`] = this.data.image[i-1]
    }
    if (this.data.type == 2) {
      this.data.goods.map((item, index) => {
        datap[`goodsComments[${index}].id`] = item.id;
        datap[`goodsComments[${index}].evaluationStatus`] = item.evaluationStatus;
      })
      getCommentEidt({
        data: Object.assign({
          id: this.data.orderid,
          sorce: this.data.sorce,
          commentText: this.data.commentText,
          isAnonymous: this.data.isAnonymous,
        }, obj, datap),
        success:(res)=>{
          this.show("修改评论成功");
          setTimeout(() => {
            wx.navigateBack();
          }, 1000)
        }
      })
    }else{
      this.data.goods.map((item, index) => {
        if (item.skuId) {
          datap[`goodsComments[${index}].skuId`] = item.skuId
        }
        datap[`goodsComments[${index}].goodsId`] = item.goodsId;
        datap[`goodsComments[${index}].evaluationStatus`] = item.evaluationStatus;
      })
      postComment({
        data: Object.assign({
          orderId: this.data.orderid,
          sorce: this.data.sorce,
          commentText: this.data.commentText,
          isAnonymous: this.data.isAnonymous ,
        }, obj, datap),
        success: (res) => {
          this.show("评价成功");
          setTimeout(() => {
            wx.navigateBack();
          }, 1000)

        }
      })
    }
    
  },
  bindinput(e){
    this.setData({
      commentText: e.detail.value
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    new app.ToastPannel();
    if(this.data.type==2){
      //获取评价
      getCommentDetail({
        data:{
          id: this.data.orderid
        },
        success:(res)=>{
          getShopDetail({
            data: {
              shopId: res.result.shopId,
              longitude: "",
              latitude: "",
            },
            success: (resd) => {
              this.setData({
                shopinfo: resd.result
              })
            }
          })
          let imageData=[];
          if (res.result.commentImg1){
            imageData.push(res.result.commentImg1)
          }
          if (res.result.commentImg2) {
            imageData.push(res.result.commentImg2)
          }
          if (res.result.commentImg3) {
            imageData.push(res.result.commentImg3)
          }
          this.setData({
            orderList: res.result,
            goods: res.result.goodsComments,
            image: imageData,
            sorce: res.result.score,
            commentText: res.result.commentText,
            isAnonymous: res.result.isAnonymous
          })
        }
      })

    }else{
      getOrderOetails({
        data: {
          memberId: 1,
          orderId: this.data.orderid
        },
        success: (res) => {
          getShopDetail({
            data: {
              shopId: res.result.shopId,
              longitude: "",
              latitude: "",
            },
            success: (resd) => {
              this.setData({
                shopinfo: resd.result
              })
            }
          })
          res.result.goods.map(item => {
            item.evaluationStatus = -1
          })
          this.setData({
            orderList: res.result,
            goods: res.result.goods
          })
        }
      })
    }
    
  },
  clickIcon(e){
    let { id } = e.currentTarget.dataset;
    this.data.goods.map(item=>{
      if(item.id == id){
        item.evaluationStatus = 0
      }
    })    
    this.setData({
      goods: this.data.goods
    })

  },
  clickIcon2(e){
    let { id } = e.currentTarget.dataset;
    this.data.goods.map(item => {
      if (item.id == id) {
        item.evaluationStatus = 1
      }
    })   
    this.setData({
      goods: this.data.goods
    })
  },
  uploadImage(){
    this.setData({
      actionSheetHidden: false,
    })
  },
   actionSheetChange() {
    this.setData({
      actionSheetHidden: true
    })
  },
  bindTap(e) {
    let { name } = e.currentTarget.dataset;
    let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid')
    if (name == "相机拍摄") {
      let uploadTask = wx.chooseImage({
        count: 1, // 默认9
        // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.dir(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          wx.uploadFile({
            url: host + "/api/upload/photoUpload",
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "content-type": "multipart/form-data",
              "Shop-Token": token,
              "Shop-UID": uid
            },
            formData: {
              'file': tempFilePaths[0]
            },
            success: (res) => {
              console.dir(res)
              this.setData({
                image: [...this.data.image, JSON.parse(res.data).result]//this.data.image.push(JSON.parse(res.data).result)
              })
            }, fail: (red) => {
              console.dir(res)
            }
          })
        }
      })


    } else {
      let uploadTask = wx.chooseImage({
        count: 1, // 默认9
        //  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          wx.uploadFile({
            url: host + "/api/upload/photoUpload",
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "content-type": "multipart/form-data",
              "Shop-Token": token,
              "Shop-UID": uid
            },
            formData: {
              'file': tempFilePaths[0]
            },
            success: (res) => {
              this.setData({
                image:  [...this.data.image, JSON.parse(res.data).result]
              })
              console.dir([...this.data.image, JSON.parse(res.data).result])
            }, fail: (red) => {
              console.dir(res)
            }
          })
        }
      })


    }
    this.setData({
      actionSheetHidden: true
    })
  },
  clickRader(e){
    let { id } = e.currentTarget.dataset;
    this.setData({
      sorce: id
    })
  },
  closeImage(e){
    let { name } = e.currentTarget.dataset;
    this.setData({
      image: this.data.image.filter(item => item !== name)
    })
  },
  clickAnonymous(){
    this.setData({
      isAnonymous: this.data.isAnonymous==0?1:0
    })
  }

})