// index.js
let app = getApp()
import { goodsListComment,totalGoodsComment } from '../../actions/classification'
let query = {}
Page({

  /**
   * 页面的初始数据
   */

  data: {
    shopinfo: {},//wx.getStorageSync("shopinfo"),
    imageList: [],
    markers: [],
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    tabKey: 0,
    currentCommentIndex: 0,
    windowWidth: "",
    windowHeight: "",
    allCurrentPage: 1,
    hasImgCurrentPage: 1,
    goodCurrentPage: 1,
    badCurrentPage: 1,
    allData: [],
    hasImgData: [],
    goodData: [],
    badData: [],
    load: false,
    hasload: false,
    goodload: false,
    badload: false,
    top: false,
      theme: "#FF004C"

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options;
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
   

  },
  onReady: function (e) {

  },

  onShow: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    totalGoodsComment({
        data: {},
        id: query.id,
        success: (res) => {
          this.setData({
            ratenumber: res.result
          })
        }
    })
    this.getData(0);
    this.getData(1);
    this.getData(2);
    this.getData(3);

  },
  scrollLower() {
    if (this.data.currentCommentIndex == 0 && this.data.load) {
      return;
    } else if (this.data.currentCommentIndex == 1 && this.data.hasload) {
      return;
    } else if (this.data.currentCommentIndex == 2 && this.data.goodload) {
      return;
    } else if (this.data.currentCommentIndex == 3 && this.data.badload) {
      return;
    } else {
      this.getData(this.data.currentCommentIndex)
    }
  },
  previewImage(e){
    let { id, item} = e.currentTarget.dataset;
    let img=[]
    if(item.commentImg1){
      img.push(item.commentImg1)
    }
    if (item.commentImg2) {
      img.push(item.commentImg2)
    }
    if (item.commentImg3) {
      img.push(item.commentImg3)
    }
    wx.previewImage({
      current: id, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  },
  clickTitle(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  },
  bindscroll(e) {

    if (e.detail.scrollTop - 50 > this.data.windowHeight) {
      this.setData({
        top: true
      })
    }
    if (e.detail.scrollTop < 90) {
      this.setData({
        top: false
      })
    }

  },
  getData(type) {

    if (this.data.currentCommentIndex == 0) {
      this.setData({
        load: true
      })
    } else if (this.data.currentCommentIndex == 1) {
      this.setData({
        hasload: true
      })
    } else if (this.data.currentCommentIndex == 2) {
      this.setData({
        goodload: true
      })
    } else if (this.data.currentCommentIndex == 3) {
      this.setData({
        badload: true
      })
    }
    goodsListComment({
      data: {
        'page.pageSize': 10,
        'page.currentPage': this.data.currentCommentIndex == 0 ? this.data.allCurrentPage : this.data.currentCommentIndex == 1 ? this.data.hasImgCurrentPage : this.data.currentCommentIndex == 2 ? this.data.goodCurrentPage : this.data.badCurrentPage,
        goodsId: query.id,
        type: type
      },
      success: (res) => {
        switch (type) {
          case 0:
            if (res.result.totalPage <= this.data.allCurrentPage) {
              this.setData({
                load: true,
              })
            } else {
              this.setData({
                load: false,
              })
            }
            this.setData({
              allData: [].concat(this.data.allData, res.result.data),
              allCurrentPage: this.data.allCurrentPage + 1
            })
            break;
          case 1:
            if (res.result.totalPage <= this.data.hasImgCurrentPage) {
              this.setData({
                hasload: true,
              })
            } else {
              this.setData({
                hasload: false,
              })
            }
            this.setData({
              hasImgData: [].concat(this.data.hasImgData, res.result.data),
              hasImgCurrentPage: this.data.hasImgCurrentPage + 1
            })
            break;
          case 2:
            if (res.result.totalPage <= this.data.goodCurrentPage) {
              this.setData({
                goodload: true,
              })
            } else {
              this.setData({
                goodload: false,
              })
            }
            this.setData({
              goodData: [].concat(this.data.goodData, res.result.data),
              goodCurrentPage: this.data.goodCurrentPage
            })
            break;
          case 3:
            if (res.result.totalPage <= this.data.badCurrentPage) {
              this.setData({
                badload: true,
              })
            } else {
              this.setData({
                badload: false,
              })
            }
            this.setData({
              badData: [].concat(this.data.badData, res.result.data),
              badCurrentPage: this.data.badCurrentPage
            })
            break;
          default:
            return;
        }
      }
    })

  },
  //拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopinfo.servicePhone
    })
  },
  goPicsPage(e) {
    let { index, resouce } = e.currentTarget.dataset;
    let data = []
    if (resouce == 'shopQualifications') {
      data = this.data.shopQualifications
    } else {
      data = this.data.imageList
    }
    wx.previewImage({
      current: data[index || 0], // 当前显示图片的http链接
      urls: data// 需要预览的图片http链接列表
    })
  },
  reportSeller(e) {
    wx.navigateTo({
      url: `/pages/report/index`
    })
  },
  //tab 
  changeTab(e) {
    let { key } = e.currentTarget.dataset;
    let { tabkey } = this.data
    if (key != tabkey) {
      this.setData({
        tabKey: key
      })
    }
  },
  changeComment(e) {
    let { index } = e.currentTarget.dataset;
    let { currentCommentIndex } = this.data
    if (index != currentCommentIndex) {
      this.setData({
        currentCommentIndex: index
      })
    }
  }
})