import { postOrder, orderAdressList, getDeliveryTime, getShopPay, wxPay, getPromotionMoney, updataDeliveryTime, changeShopPay, changePayType } from '../../actions/order'
import { clearShopCartAction } from '../../actions/shopcart'
import { add, mul } from '../../utils/util'
const { connect } = require('../../libs/wechat-weapp-redux.js')
let app = getApp()
let query = {}
const pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: "",
    windowWidth: "",
    serverImg: app.globalData.serverImg,
    showdelivery: false, //是否显示配送时间选择界面
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      color: this.data.shopInfo.theme,
      greycolor: app.globalData.greycolor,
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
    new app.ToastPannel();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    let products = [];
   
    this.data.orderSubmitData.cart.map(item => {
      products.push({
        productId: item.id,
        amount: item.number,
        skuId: item.skuid ? item.skuid : ""
      })
    })
    //获取优惠方式
    this.dispatch(getPromotionMoney({
      data: {
        shopId: this.data.shopInfo.id,
        products: products
      }
    }))
    //获取支付类型
    if (!this.data.orderSubmitData.shopPay.sucess) {
      this.dispatch(getShopPay({
        data: {
          id: this.data.shopInfo.id
        }
      }))
    }
    //获取送货地址 初始化界面有数据不请求服务器
    if (this.data.orderSubmitData.available.id) {

    } else {
      this.dispatch(orderAdressList({
        data: {
          memberId: 1,
          shopId: this.data.shopInfo.id
        }
      }))
    }


    //获取自提时间
    this.dispatch(getDeliveryTime({
      data: {
        id: this.data.shopInfo.id,
      }
    }))


  },
  //点击选择地址
  chengeAdress() {
    wx.navigateTo({
      url: '/pages/address/select/index'
    })
  },
  //自提
  clickZiTi() {
    this.dispatch(changeShopPay(0));
  },
  //送货上门
  clickDelivery() {
    this.dispatch(changeShopPay(1));
  },
  //快递
  clickKuaiDi() {
    this.dispatch(changeShopPay(2));
  },
  //微信支付
  checkToWx() {
    this.dispatch(changePayType(1))
  },
  //到店支付
  checkToXz() {
    this.dispatch(changePayType(0))
  },
  //点击配送时间
  clickItmeTime(e) {
    let { time } = e.currentTarget.dataset;
    this.dispatch(updataDeliveryTime(time))
    this.setData({
      showdelivery: false
    })
  },
  cancal() {
    this.setData({
      showdelivery: false
    })
  },
  //点击配送时间
  sendAgain() {
    this.setData({
      showdelivery: true
    })
  },
  //提交订单
  postClickOrder(e) {
    let openId = wx.getStorageSync('openid')
    let products = [];
    this.data.orderSubmitData.cart.map(item => {
      products.push({
        "productId": item.id,
        "amount": item.number,
        "skuId": item.skuid ? item.skuid : ""
      })
    })
    let postData = {
      "addressId": this.data.deliveryType == 1 ? this.data.orderSubmitData.available.id : "",
      "serviceTime": this.data.orderSubmitData.deliveryTime.timeSolts.find(item => item.check == true).deliveryDate,
      "shipType": this.data.deliveryType, // 0自提 1送货上门
      "remark": "压力测试下单",
      "fromId": e.detail.formId,
      "openId": openId,
      "shopId": this.data.shopInfo.id,
      "orderSource": 0, //0 平台
      "payType": this.data.orderSubmitData.shopPay.selsetpay,//0 线下 1 微信 2 支付宝
      "products": products
    }
    postOrder({
      data: postData,
      success: (res) => {
        if (res.errorCode !== 0) {
          this.show(res.errorMsg);
          return;
        }
        wx.showToast({
          title: '订单提交成功',
          icon: 'success',
          duration: 2000
        })
        clearShopCartAction({}, this)
        console.dir(this.data.orderSubmitData.shopPay.selsetpay)
        if (this.data.orderSubmitData.shopPay.selsetpay == 0) {
          wx.redirectTo({
            url: `/pages/payed/index?type=${this.data.deliveryType}&payType=${this.data.orderSubmitData.shopPay.selsetpay}&money=${this.data.premoney}&id=${res.result[0]}`
          })
        } else {
          wxPay({
            data: {
              orderId: res.result[0],
              openId: openId,
              shopId: this.data.shopInfo.id
            },
            success: (resd) => {
              if (resd.errorCode !== 0) {
                this.show(resd.errorMsg);
                return;
              }
              wx.requestPayment({
                'timeStamp': resd.result.timeStamp.toString(),
                'nonceStr': resd.result.nonceStr,
                'package': resd.result.prepayId,
                'signType': resd.result.signType,
                'paySign': resd.result.paySign,
                'success': (resd) => {
                  wx.redirectTo({
                    url: `/pages/payed/index?type=${this.data.deliveryType}&payType=${this.data.orderSubmitData.shopPay.selsetpay}&money=${this.data.premoney}&id=${res.result[0]}`
                  })
                },
                'fail': (resd) => {
                  wx.redirectTo({
                    url: `/pages/orderDetail/index?orderId=${res.result[0]}`
                  })
                }
              })
            }
          })
        }
      },
      error: (res) => {
        this.show(res.errorMsg);
      }
    })
  }
}
function mapStateToProps(state) {
  //获取选择配送时间
  let sendTime = state.orderSubmitData.deliveryTime.timeSolts.find(item => item.check == true)
  //获取商品全额
  let allmoney = 0;
  state.orderSubmitData.cart.map(item => {

    allmoney += item.price * item.number;
  })
  allmoney = parseFloat(allmoney).toFixed(2)
  //实付金额
  let premoney = 0;
  //0不参加活动   1满减  2折扣
  if (state.orderSubmitData.promotionMoney.promotionType == 0) {
    //送货上门 加上配送费 selected:1 有配送费
    if (state.orderSubmitData.shopPay.selected == 1) {
      premoney = add(allmoney, state.orderSubmitData.deliveryTime.deliveryFee)
    } else {
      premoney = allmoney;
    }
  } else if (state.orderSubmitData.promotionMoney.promotionType == 1) {
    if (state.orderSubmitData.shopPay.selected == 1) {
      premoney = add(mul(allmoney, state.orderSubmitData.promotionMoney.fullCut.cutMoney), state.orderSubmitData.deliveryTime.deliveryFee)
    } else {
      premoney = mul(allmoney, state.orderSubmitData.promotionMoney.fullCut.cutMoney)
    }
  } else if (state.orderSubmitData.promotionMoney.promotionType == 2) {
    if (state.orderSubmitData.shopPay.selected == 1) {
      premoney = add(state.orderSubmitData.promotionMoney.discount.discountMoney, state.orderSubmitData.deliveryTime.deliveryFee)
    } else {
      premoney = state.orderSubmitData.promotionMoney.discount.discountMoney
    }
  }
  console.dir(state.orderSubmitData)
  return {
    shopcart: state.shopcart,
    shopInfo: state.shopInfo,
    orderSubmitData: state.orderSubmitData,
    sendTime: sendTime,
    deliveryType: state.orderSubmitData.shopPay.selected, // 0自提 1送货上门 2 快递
    allmoney: allmoney,
    premoney: premoney // 实付款
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)


