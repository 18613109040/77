
import { getOrderOetails, orderCancel, receiptGoods, wxPay} from '../../actions/order'
import { convertTimeToStr, confirm} from '../../utils/util'
const { connect } = require('../../libs/wechat-weapp-redux.js')
var QR = require("../../libs/qrcode.js");
let app = getApp()
const pageConfig = {

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderList: {},
    theme: "#FF004C",
    imagePath: '',
    greycolor: app.globalData.greycolor
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth:"",
      orderId: options.orderId,
      greycolor: app.globalData.greycolor
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        })
      }
    })
  },
  //点击二维码
  clickQrcode(){

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
    })
    getOrderOetails({
      data:{
        memberId:1 ,
        orderId: this.data.orderId
      },
      success:(res)=>{
        this.setData({
          orderList: Object.assign(res.result,
            { serviceTime: res.result.serviceTime ? res.result.serviceTime.split(' ')[1]:""})
        })
        var size = this.setCanvasSize();//动态设置画布大小
        if (res.result.pickCode)
          this.createQrCode(res.result.pickCode, "mycanvas", 150, 150);
      }
    })
    
  
  },
  setCanvasSize: function () {
    var size = {};
    try {
      
      var width = 150;
      var height = 150;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage () {
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success:(res)=> {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        this.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //拨打电话
  callPhone(){
   
    wx.makePhoneCall({
      phoneNumber: this.data.orderList.shopPhone
    })
  },
  
  //去评价
  goComment(e) {
    wx.navigateTo({
      url: `/pages/addComment/index?id=${this.data.orderId}`
    })
  },

  nextPage:function(){
    wx.switchTab({
      url: '/pages/classification/index'
    })
  },
  /**
   * 取消订单  
   */
  cancelOrder:function(e){
    var that = this
    confirm({
      content: '确定取消订单？',
      ok:()=>{
        orderCancel({
          data:{
            memberId:1,
            orderId: that.data.orderId
          },
          success:(res)=>{
            wx.showToast({
              title: '订单取消成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack();
          }
        })
      }
    })
  },
  //立即支付
  goPay(){
    let openId = wx.getStorageSync('openid');
    wxPay({
      data: {
        orderId: this.data.orderId,
        openId: openId
      },
      success: (res) => {
        wx.requestPayment({
          'timeStamp': res.result.timeStamp.toString(),
          'nonceStr': res.result.nonceStr,
          'package': res.result.prepayId,
          'signType': res.result.signType,
          'paySign': res.result.paySign,
          'success': (res) => {
            wx.redirectTo({
              url: `/pages/payed/index?type=-1&payType=${this.data.orderList.shipType}&money=${this.data.orderList.totalMoney}&id=${this.data.orderId}`
            })
          },
          'fail': function (res) {

          }
        })
      }
    })

  },
  /**
   * 确定收货  
   */
  confirmReceipt(e){
    var that = this
    wx.showModal({
      content: '确定商品已送达？',
      showCancel: true,
      confirmColor: '#ff004c',
      success:  (res)=> {
        receiptGoods({
          data: {
            orderId: that.data.orderId
          },
          success: (res) => {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack();
          }
        })
      }
    })
  },

  /**
   * 催单
  */
  Reminder:function(){
    wx.showActionSheet({
      itemList: ['打电话催催单', `商家电话:${this.data.orderList.shopPhone}`],
      success: (res)=> {
        wx.makePhoneCall({
          phoneNumber: this.data.orderList.shopPhone
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
}
function mapStateToProps(state) {
  return {
    shopInfo: state.shopInfo
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)