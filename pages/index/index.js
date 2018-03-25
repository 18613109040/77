import { getKeyAdress } from '../../utils/util'
const { connect } = require('../../libs/wechat-weapp-redux.js')
import { clearShopCartAction } from '../../actions/shopcart'
import { emptyCategoryListAction, emptyCategoryGoodsAction } from '../../actions/classification'
import { getPlatformListAction, getPlatfromCarouselAction, getShopByLatAndLongAction, emptyShopListAction } from '../../actions/platformHome.js'
import { getShopInfoByIdAction} from '../../actions/shop.js'
let app = getApp()
const pageConfig = {
  /**
   * @address {String} 定位地址
   * @serverImg {String} 单前项目图片地址
   * @filterindex {Number}筛选选中索引 
   * @fiterBar {Array}筛选数组
   * @params {Object=>{ 查询参数,用于查询店铺
   *      @page.currentPage 页码
   *      @page.pageSize 页数
   *      @longitude 经度
   *      @latitude 维度
   *      @shopName 店铺名称
   *      @sortType 排序类型
   *      @myLongitude 当前经度
   *      @myLatitude 当前维度
   * }} 
   */
  data: {
    address: "", 
    serverImg: app.globalData.serverImg,
    filterindex: 0,
    fiterBar: ['全部商家', '销量最高', '距离最近'],
    params: {
      'page.currentPage': 1,
      'page.pageSize': 15,
      longitude: "",
      latitude: "",
      shopName: "",
      sortType: "",
      myLongitude: "",
      myLatitude: ""
    }
  },
  /**
   * 获取分类列表，轮播，商家列表
   * @getPlatformListAction {func} 获取分类列表
   * @getPlatfromCarouselAction {func} 轮播
   * @getShopByLatAndLongAction {func} 商家列表
   * @app.getCurrentLoaction {func} 获取经纬度
   * @app.getCurrentAddress {func} 获取地址
   */
  onLoad: function (options) {
    const { platformList, platfromCarousel, shopsList } = this.data;
    if (platformList.length == 0)
      this.dispatch(getPlatformListAction())
    if (platfromCarousel.length == 0)
      this.dispatch(getPlatfromCarouselAction())
    
      app.getCurrentLoaction(res => {
        const { latitude, longitude } = res;
        let { params } = this.data;
        let options = Object.assign({}, params, {
          longitude: longitude,
          latitude: latitude,
          myLongitude: longitude,
          myLatitude: latitude
        })
        this.setData({
          params: options
        })
        if (shopsList.data.length == 0) {
        this.dispatch(getShopByLatAndLongAction(options))
        }
      })
    
   
    wx.showLoading({
      title: "定位中"
    })
    app.getCurrentAddress((res) => {
      wx.hideLoading()
      wx.setStorageSync("userInfo", res)
      this.setData({
        address: res.title,
      })
    })
  },
  /**
  * 分享
  */
  onShareAppMessage(res) {
    if (res.from === 'button') {
      
    }
    return {
      title: '思埠便利店',
      path: `/pages/index/index`,
      success: function (res) {
        console.debug(res)
      },
      fail: function (res) {
    
      }
    }
  },
  onTapImage(e) {
    let { data } = e.currentTarget.dataset
    if (data.actionType == 1) {
      this.redirectToHome({
        currentTarget: {
          dataset: {
            name: {
              id: data.shopId
            }
          }
        }
      })
    }
  },
  /**
   * 点击筛选条件 重置筛选条件 重置数据
   * @emptyShopListAction {func} 清空redux shopsList数据
   */
  clickTab(e) {
    const { id } = e.currentTarget.dataset;
    if (id !== this.data.filterindex) {
      this.dispatch(emptyShopListAction())
      let { params } = this.data;
      let options = Object.assign({}, params, {
        'page.currentPage': 1,
        sortType: id == 0 ? "" : id == 1 ? "sale" : id == 2 ? "distance" : ""
      })
      this.setData({
        params: options,
        filterindex: id
      })
      this.dispatch(getShopByLatAndLongAction(options))
    }
  },
  /**
   * 搜索店铺 重置搜索条件 
   */
  shopNameChange(e) {
    this.dispatch(emptyShopListAction())
    let { params } = this.data;
    let options = Object.assign({}, params, {
      'page.currentPage': 1,
      shopName: e.detail.value
    })
    this.setData({
      params: options
    })
    this.dispatch(getShopByLatAndLongAction(options))
  },
  /**
   * 页面上拉触底事件的处理函数
   * 获取下一页店铺信息 (搜索条件不变)
   */
  onReachBottom: function () {
    let { totalCount, data } = this.data.shopsList;
    let currentShopListLength = data.length;
    if (currentShopListLength < totalCount) {
      let { params } = this.data;
      let options = Object.assign({}, params, {
        'page.currentPage': parseInt(currentShopListLength / params['page.pageSize']) + 1,
      })
      this.setData({
        params: options
      })
      this.dispatch(getShopByLatAndLongAction(options))
    }
  },
  /**
   * 切换到首页前准备工作
   * @data {Object}店铺信息 
   * @flage {Number}来源标识 1店铺 2商品 
   * @getShopInfoByIdAction {func} 获取店铺信息
   * @clearShopCartAction {func} 清空购物车数据
   * @emptyCategoryListAction {func} 清空分类列表
   * @emptyCategoryGoodsAction {func} 清空分类商品
   */
  comWillLeaveToDo(data,flage){
    app.globalData.color = data.theme ? data.theme : "#FF004C";
    wx.removeStorageSync('cart');
    clearShopCartAction({}, this);
    emptyCategoryListAction({}, this);
    emptyCategoryGoodsAction({}, this);
    const { myLongitude, myLatitude } = this.data.params;
    console.dir(this.data.params)
    this.dispatch(getShopInfoByIdAction({
      shopId: data.id,
      longitude: myLongitude,
      latitude: myLatitude,
    },(res)=>{
      wx.setStorageSync("shopinfo", res.result)
      if (flage == 1) {
        wx.switchTab({
          url: '/pages/home/index'
        })
      } else {
        wx.navigateTo({
          url: `/pages/commodityDetails/index?id=${data.goodsId}`
        })
      } 
    }))
  },
  /**
   * 点击店铺信息进入店铺
   */
  switchToShopHome(e){
    let { item } = e.currentTarget.dataset;
    this.comWillLeaveToDo(item,1)  
  },
  /**
   * 进入商品详情
   * 
   */
  navigateToGoodDetail(e) {
    let { item, id} = e.currentTarget.dataset;
    this.comWillLeaveToDo(Object.assign({}, item, { goodsId:id }),2)  
  },
  onShopListSm(e) {
    let { data } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/home_revise_sm/index?type=${data.businessTypeId}&&name=${data.businessTypeName}`
    })
  }
}
/***
 * 修饰器注入 data 数据
 * @platformList {Array} 分类列表
 * @platfromCarousel {Array} 轮播图
 * @shopsList {Object} 店铺列表
 */
function mapStateToProps(state) {
  return {
    platformList: state.platformList,  
    platfromCarousel: state.platfromCarousel,
    shopsList: state.shopsList
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)