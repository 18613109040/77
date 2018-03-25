// order.js
/**
 * satus 
 * 1 待支付 2.等待商家接单 3商家已接单 4 商家决绝接单 5配送/自提 6订单完成 7 交易关闭  99 退单
 * 
 */
import { getOrderList, orderCancel, receiptGoods, deleteOrder, wxPay, getOrderListAction, emptyOrderListAction} from '../../actions/order'
import { convertTimeToStr, confirm } from '../../utils/util'
let app = getApp()
const { connect } = require('../../libs/wechat-weapp-redux.js')
const pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    load: false,
    showTop:false,
    greycolor: app.globalData.greycolor,
    is_empty:false,
    shopinfo: wx.getStorageSync('shopinfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      greycolor: app.globalData.greycolor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onHide(){
    this.setData({
      load: false
    })
    emptyOrderListAction({},this)
  },
 
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    })
    this.getInintData();
  },
  getInintData(){
    getOrderListAction({
      data: {
        status: "",
        "page.pageSize": 10,
        "page.currentPage": 1
      },
      success: (res) => {
        if (res.errorCode === 0) {
          if (res.result.totalCount <= 10) {
            this.setData({
              load: true
            })
          } else {
            this.setData({
              load: false
            })
          }
        }
      }
    }, this)
  },
  // onPullDownRefresh() {
  //   emptyOrderListAction({}, this)
  //   this.getInintData();
  //   wx.stopPullDownRefresh();
  // },
  onPageScroll(e){
    if (e.scrollTop > 200 && !this.data.showTop){
       this.setData({
         showTop:true
       })
    }
    if (e.scrollTop <100){
      this.setData({
        showTop: false
      })
    }
  },
  onReachBottom() {
    if (this.data.load){
      return 
    }else{
      getOrderListAction({
        data: {
          status: "",
          "page.pageSize": 10,
          "page.currentPage": Math.ceil(this.data.orderList.data.length/10)+1
        },
        success: (res) => {
          if (res.errorCode === 0) {
            if (res.result.data.length + this.data.orderList.data.length  < res.result.totalCount) {
              this.setData({
                load: false
              })
            } else {
              this.setData({
                load: true
              })
            }
          }
        }
      }, this)
    }
  },
  //删除订单
  deOreder(e){
    let { id } = e.currentTarget.dataset;
    confirm({
      content: '确定删除订单',
      ok: () => {
        deleteOrder({
          data: { orderId:id},
          success:(res)=>{
            wx.showToast({
              title: '订单删除成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              load: false
            })
            emptyOrderListAction({}, this)
            this.getInintData();
          }          
        })
      }
    })
    
   
  },
  /**
   * 跳转到订单详情
   */
  onNextPage:function(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/index?orderId=${id}`
    })
  },
  /**
  * 催单
 */
  Reminder: function (e) {
    let { item } = e.currentTarget.dataset;
    console.dir(item)
    wx.showActionSheet({
      itemList: ['打电话催催单', `商家电话:${item.shopPhone}`],
      success: (res)=> {
        wx.makePhoneCall({
          phoneNumber: item.shopPhone
        })
      },
      fail: function (res) {
       
      }
    })
  },
  //立即支付
  goPay(e) {
    let openId = wx.getStorageSync('openid');
    let { id, item } = e.currentTarget.dataset;
    wxPay({
      data: {
        orderId: id,
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
              url: `/pages/payed/index?type=-1&payType=${item.shipType}&money=${item.totalMoney}&id=${id}`
            })
          },
          'fail': function (res) {

          }
        })
      }
    })

  },
  //确认收货
  receipts(e){
    let { id } = e.currentTarget.dataset;
    confirm({
      content: '确定已收到货？',
      ok: () => {
        receiptGoods({
          data: {
            orderId: id
          },
          success: (res) => {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              load: false
            })
            emptyOrderListAction({}, this)
            this.getInintData();
          }
        })

      }
    })
    
  },
  /**
   * 取消订单  
   */
  cancelOrder: function (e) {
    let { id } = e.currentTarget.dataset;
    var that = this
    confirm({
      content: '确定取消订单？',
      ok: () => {
        orderCancel({
          data: {
            orderId: id
          },
          success: (res) => {
            wx.showToast({
              title: '订单取消成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              load: false
            })
            emptyOrderListAction({}, this)
            this.getInintData();
          }
        })
      }
    })
  },
  //去评价
  goComment(e){
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/addComment/index?id=${id}`
    })
  }
}
function mapStateToProps(state) {
  return {
    orderList: state.orderList,
    shopInfo: state.shopInfo
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)