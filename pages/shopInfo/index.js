import { getShopCommentNumber, getShopComment, emptyComment } from '../../actions/shop.js'
const { connect } = require('../../libs/wechat-weapp-redux.js')
const app = getApp()
const pageConfig = {
  /**
   * @tabKey {Number} 选中标识 0（商家） 1(评论)
   * @currentCommentIndex {Number} 选中评价标识 0（全部） 1（有图） 2（好评） 3（差评）
   * @pageSize {Number} 评论每次请求数据数量
   * @reachBottomLoad {Bool} 是否可以下拉
   */
  data: {
    tabKey: 0,
    currentCommentIndex: 0,
    pageSize: 10,
    reachBottomLoad: true,
    searchBar: ['全部', '有图', '好评', '差评']
  },
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
    })
    wx.setNavigationBarTitle({
      title: this.data.shopInfo.name
    })
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    //this.dispatch(emptyComment())
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.dispatch(emptyComment())
  },
  /**
   * 点击评论刷选条件
   * @totalEvaluate {Object} 全部评价
   * @hasImage {Object} 有图评价
   * @goodEvaluate {Object} 好评
   * @badEvaluate {Object} 差评
   * @shopInfo {Object} 店铺信息
   * @index {Number} 选中标识 0（全部） 1（有图） 2（好评） 3（差评）
   * @getShopComment {func} 获取评价api
   */
  changeComment(e) {
    let { totalEvaluate, hasImage, goodEvaluate, badEvaluate, shopInfo, pageSize } = this.data;
    let { index } = e.currentTarget.dataset;
    if (index == 0 && totalEvaluate.code == -1) {
      this.getCommentData(0)
    } else if (index == 1 && hasImage.code == -1) {
      this.getCommentData(1)
    } else if (index == 2 && goodEvaluate.code == -1) {
      this.getCommentData(2)
    } else if (index == 3 && badEvaluate.code == -1) {
      this.getCommentData(3)
    }
    this.setData({
      currentCommentIndex: index
    })
  },
  /**
   * 举报商家
   */
  reportSeller() {
    wx.navigateTo({
      url: `/pages/report/index`
    })
  },
  /**
   * 查看店家图片和档案
   * @resouce {String} "shopQualifications"档案 "imageList"店铺图片
   */
  goPicsPage(e) {
    let { index, resouce } = e.currentTarget.dataset;
    let data = []
    if (resouce == 'shopQualifications') {
      data = this.data.shopQualifications
    } else {
      data = this.data.imageList
    }
    if (data.length > 0) {
      wx.previewImage({
        current: data[index || 0], // 当前显示图片的http链接
        urls: data// 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 下拉底部加载评价数据
   * @tabKey {Number} 0 商家 1评价
   * @reachBottomLoad {Bool} 是否可以下拉
   * @shopComment.load {Bool} 是否已经拉取所有数据
   */
  onReachBottom() {
    let { tabKey, currentCommentIndex, shopComment, evaluate, pageSize, shopInfo, reachBottomLoad } = this.data;
    if (tabKey == 1 && reachBottomLoad && shopComment.load) {
      this.setData({
        reachBottomLoad: false
      })
      let currentPage = parseInt(evaluate[currentCommentIndex].length / pageSize) + 1
      this.getCommentData(currentCommentIndex, currentPage, (res) => {
        this.setData({
          reachBottomLoad: true
        })
      })
    }
  },
  /**
   * 显示评价图片
   */
  previewImage(e) {
    let { id, item } = e.currentTarget.dataset;
    let img = []
    if (item.commentImg1) {
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
  /**
   * 导航去店
   */
  goToShopByMap() {
    let { tabkey, shopInfo, shopComment, pageSize } = this.data
    wx.openLocation({
      latitude: shopInfo.latitude,
      longitude: shopInfo.longitude,
      scale: 28,
      name: shopInfo.name,
      address: shopInfo.address
    })
  },
  /**
   * @tabkey  {Number} 0 商家 1评价
   * @key {Number} 单前选中索引  0 商家 1评价
   */
  changeTab(e) {
    let { key } = e.currentTarget.dataset;
    let { tabkey, shopInfo, shopComment, pageSize } = this.data
    if (key != tabkey) {
      if (key == 1 && shopComment.code == -1) {
        this.dispatch(getShopCommentNumber({
          shopId: shopInfo.id
        }))
        this.getCommentData(0)
        // this.dispatch(getShopComment({
        //   'page.pageSize': pageSize,
        //   'page.currentPage': 1,
        //   'shopId': shopInfo.id,
        //   'type': 0
        // }))
      }
      this.setData({
        tabKey: key
      })
    }
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfo.servicePhone
    })
  },
  getCommentData(type, currentPage = 1, callback = () => { }) {
    let { pageSize, shopInfo } = this.data
    this.dispatch(getShopComment({
      'page.pageSize': pageSize,
      'page.currentPage': currentPage,
      'shopId': shopInfo.id,
      'type': type
    }, (res) => {
      callback(res)
    }))
  }
}
/**
 * @shopInfo {Object} 店铺信息
 * @imageList {Array} 店家图片
 * @shopQualifications {Array} 店家档案
 * @badEvaluateNum {Number} 差评数量
 * @goodEvaluateNum {Number} 好评数量
 * @hasImageNum {Number} 有图数量
 * @totalEvaluateNum {Number} 全部评价数量
 * @totalEvaluate {Object} 
 * ...
 * @markers 地图参数
 * 
 */
function mapStateToProps(state) {
  const { badEvaluate, goodEvaluate, hasImage, totalEvaluate } = state.shopComment
  let evaluate = [totalEvaluate.data, hasImage.data, goodEvaluate.data, badEvaluate.data]
  let shopInfo = state.shopInfo;
  let { shopEnv, shopFace, shopQualifications, latitude, longitude } = shopInfo
  shopEnv = (shopEnv && shopEnv.split(',')) || [];
  shopFace = (shopFace && shopFace.split(',')) || []
  let evalutateNum = [totalEvaluate.num, hasImage.num, goodEvaluate.num, badEvaluate.num]
  return {
    shopInfo: shopInfo,
    imageList: [...shopEnv, ...shopFace],
    shopQualifications: (shopQualifications && shopQualifications.split(',')) || [],
    evalutateNum: evalutateNum,
    badEvaluateNum: badEvaluate.num,
    goodEvaluateNum: goodEvaluate.num,
    hasImageNum: hasImage.num,
    totalEvaluateNum: totalEvaluate.num,
    shopComment: state.shopComment,
    totalEvaluate: totalEvaluate,
    hasImage: hasImage,
    goodEvaluate: goodEvaluate,
    badEvaluate: badEvaluate,
    evaluate: evaluate,
    markers: [{
      iconPath: "../../images/universal_location_red.png",
      id: 0,
      latitude: latitude,
      longitude: longitude,
      width: 30,
      height: 30
    }]
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)