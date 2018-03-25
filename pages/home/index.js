import { getHotGoodsAction, getCarouselListAction, getSpecialsAction, getShopDetail, getGoodsByCode, getShopTopCategoryAction } from '../../actions/home'
import { updataShopCartAction, clearShopCartAction } from "../../actions/shopcart"
import { getShopInfoAction } from '../../actions/shop'
import { visitShop} from '../../actions/user'
import { emptyShopPay} from '../../actions/order.js'
import { emptyCategoryListAction, emptyCategoryGoodsAction } from '../../actions/classification'
const { connect } = require('../../libs/wechat-weapp-redux.js')
import { getShopInfoByIdAction } from '../../actions/shop.js'
const app = getApp()
let query = {};
const pageConfig = {
  /**
   * 
   */
  data: {
    serverImg: app.globalData.serverImg,
    greycolor: app.globalData.greycolor,
    color: app.globalData.color,
    theme: "#FF004C",
    modelShow: false,
    showIsRest:false,
    showGoods: false
  },
  onLoad(option) {
    query = option;
    if (option && (option.shopid || option.scene)) {
      //转发路口
      option.shopid = option.shopid || decodeURIComponent(option.scene);
      this.checkShop(option.shopid)
    }else{
      this.getinintData(this.data.shopInfo.id)
    }
    if (this.data.shopInfo.isRest){
        this.setData({
          showIsRest:true
        })
    }
  },
  onShow() {
    //统计店铺进入数量
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        if (this.data.shopInfo.id && res.data.id){
          visitShop({
            data:{
              shopId: this.data.shopInfo.id,
              userId: res.data.id
            }
          })
        }
      }
    })
    
    new app.ToastPannel();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
    })
    wx.setNavigationBarTitle({
      title: this.data.shopInfo.name
    })
   

  },
  /**
   * 获取首页界面数据
   * @getShopTopCategoryAction {func} 获取首页分类列表
   * @getCarouselListAction {func} 获取轮播图
   * @getSpecialsAction {func} 获取特价商品
   * @getHotGoodsAction {func} 获取热门商品
   * */
  getinintData(shopId) {
    this.dispatch(getShopTopCategoryAction({
      id: shopId
    }))
    
    this.dispatch(getCarouselListAction({
      shopId:shopId
    }))
    
    this.dispatch(getSpecialsAction({
      id: shopId
    }))


    this.dispatch(getHotGoodsAction({
        shopId: shopId,
        "page.pageSize": 10,
        "page.currentPage": 1
    }))
  },
  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按
    }
    return {
      title: this.data.shopInfo.name,
      path: `/pages/home/index?shopid=${this.data.shopInfo.id}`,
      success: function (res) {
        // 转发成功
        console.debug(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  minusCount() {
    let dataGoods = {}
    Object.assign(dataGoods, this.data.codeGoods, {
      number: this.data.codeGoods.number - 1
    })
    this.setData({
      codeGoods: dataGoods
    })
  },
  addCount() {
    let dataGoods = {}
    Object.assign(dataGoods, this.data.codeGoods, {
      number: this.data.codeGoods.number + 1
    })
    this.setData({
      codeGoods: dataGoods
    })
  },
  cancelModel() {
    this.setData({
      showGoods: false
    })
  },
  addCartModel() {
    updataShopCartAction(this.data.codeGoods, this);
    this.setData({
      showGoods: false
    })
  },
  //扫码
  sweepCode() {
    wx.scanCode({
      success: (res) => {
        getGoodsByCode({
          data: {
            goodsCode: res.result,
            shopId: this.data.shopInfo.id
          },
          success: (res) => {
            console.log(res)
            if (res.errorCode == 0) {
              let dataGoods = {}
              if (res.result.sku && res.result.sku.id) {
                Object.assign(dataGoods, res.result.goods, {
                  attrIds: res.result.sku.attrIds,
                  attrValues: res.result.sku.attrValues,
                  goodsCode: res.result.sku.goodsCode,
                  goodsId: res.result.sku.goodsId,
                  price: res.result.sku.price,
                  skuSalenum: res.result.sku.skuSalenum,
                  skuStock: res.result.sku.skuStock,
                  skuid: res.result.sku.id,
                  number: 1
                })
              }else{
                Object.assign(dataGoods, res.result.goods, { number: 1})
              }
              if (res.result.sku&&res.result.sku.id) {
                
                //同步本地数据
                if (this.data.shopcart && this.data.shopcart.length > 0) {
                  if (this.data.shopcart.filter(dx => dx.id == dataGoods.id && dx.multiKinds == 1).length > 0) {
                    dataGoods.number = this.data.shopcart.filter(dx => dx.id == dataGoods.id && dx.multiKinds == 1)[0].number;
                  } else {
                    dataGoods.number = 1;
                  }
                }
              } else {
                //同步本地数据
                if (this.data.shopcart && this.data.shopcart.length > 0) {
                  if (this.data.shopcart.filter(dx => dx.id == dataGoods.id && dx.multiKinds == 0).length > 0) {
                    dataGoods.number = this.data.shopcart.filter(dx => dx.id == dataGoods.id && dx.multiKinds == 0 && dx.skuid == dataGoods.skuid)[0].number;
                  } else {
                    dataGoods.number = 1;
                  }
                }
              }
              this.setData({
                codeGoods: dataGoods,
                showGoods: true
              })
            } else {
             
              this.show("条形码识别失败");
            }
          },
          error:(res)=>{
          
            this.show("条形码识别失败");
          }
        })
      },
      fail: (res) => {
        this.show("条形码识别失败");
      }
    })

  },
  //去购物车
  gotoCart(e) {
    if (this.data.shopcart.length > 0) {
      this.setData({
        modelShow: true
      })
    } else {
     this.show("请添加商品");
    }

  },
  colseBtn(){
    this.setData({
      showIsRest: false
    })
  },
  //改变地址，选择店铺
  changeAdress() {
    this.dispatch(emptyShopPay())
    wx.reLaunch({
      url: "/pages/index/index"
      // url: "/pages/index/index"
    })
  },

  onPullDownRefresh(){
    this.getinintData(this.data.shopInfo.id)
    wx.stopPullDownRefresh();
    
  },
  linktocla(e) {
    let { item } = e.currentTarget.dataset
    wx.switchTab({
      url: `/pages/classification/index`
    })
    wx.setStorageSync("selectId", item.id)
  },
  //轮播跳转 @todo 1 商店 2 商品 4公告
  carouselLink(e) {
    let { item } = e.currentTarget.dataset;
    if (item.actionType == 2) {
      wx.navigateTo({
        url: `/pages/commodityDetails/index?id=${item.paramId}`
      })
    } else if (item.actionType == 4) {
      wx.navigateTo({
        url: `/pages/announcement/index?id=${item.paramId}`
      })
    }
    else if (item.actionType == 1) {

      if (item.shopId == this.data.shopInfo.id)
        return;
      wx.showLoading({
        title: "店铺切换中..."
      })
      this.checkShop(item.shopId)
    }

  },
  //跳转商品详情
  toDetails(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  },
  //专场商品
  toSpecialPage(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/specialGoods/index?id=${id}`
    })
  },
  //切换店铺 @id 店铺iD
  checkShop(shopid) {
    wx.removeStorageSync('cart');
    clearShopCartAction({}, this);
    emptyCategoryListAction({}, this);
    emptyCategoryGoodsAction({}, this);

    app.getCurrentLoaction(res => {
      const { latitude, longitude } = res;
      this.dispatch(getShopInfoByIdAction({
        shopId: data.id,
        longitude: myLongitude,
        latitude: myLatitude,
      }, (res) => {
        this.getinintData(shopid)
        wx.setStorageSync("shopinfo", res.result)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.result.theme
        })
        wx.setNavigationBarTitle({
          title: res.result.name
        })
      }))
    })
  }
}
/***
 * 修饰器注入 data 数据
 * @shopTopCategory {Array} 分类
 * @shopImages {Array} 轮播图
 * @specials {Array} 特价商品
 * @hotGoods {Array} 热卖商品
 */
function mapStateToProps(state) {
  let { shopcart, homedetail} = state;
  const { shopTopCategory, shopImages, specials, hotGoods } = homedetail;
  
  let number = 0;
  let allmoney = 0
  shopcart.map(item => {
    number += item.number
    if (item.discountFlag == true) {
      if (item.number <= item.limitNum) {
        allmoney += item.discountPrice * item.number
      } else {
        allmoney += item.discountPrice * item.limitNum;
        allmoney += (item.number - item.limitNum) * item.price;
      }
    } else {
      allmoney += item.price * item.number
    }
  })
  hotGoods.map(item => {
    //同步本地数据
    if (shopcart && shopcart.length > 0) {
      if (shopcart.filter(dx => dx.id == item.id && dx.multiKinds == 0).length > 0) {
        item.number = shopcart.filter(dx => dx.id == item.id && dx.multiKinds == 0)[0].number;
      } else {
        item.number = 0;
      }
    } else {
      item.number = 0;
    }
  })
  return {
    hotGoods: hotGoods,
    carousel: shopImages,
    shopInfo: state.shopInfo,
    specialsGoods: specials,
    homeifcation: shopTopCategory,
    shopcart: state.shopcart,
    allnumber: number,
    allmoney: parseFloat(allmoney).toFixed(2) 
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)