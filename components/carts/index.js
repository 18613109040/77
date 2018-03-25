const app = getApp()
import { addSkuShopCartAction, decreaseSkuShopCartAction, addShopCartAction, decreaseShopCartAction } from '../../actions/shopcart'
import { addSubmitShop } from '../../actions/order'
Component({
  properties: {
    shoplist: {
      type: Array
    },
    allmoney:{
      type: String,
      value:0
    },
    color: {
      type: String,
      value: "#FF004C"
    },
    show:{
      type:Boolean
    }
  },
  data: {
    greycolor: app.globalData.greycolor,
    isHide: false,
    content: ""
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function () {
    
  },
  ready() {
    
  },
  //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  moved: function () { },
  //组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: function () { 
    
  },
  methods: {
    closeTap(e){
      let { statu } = e.currentTarget.dataset;
      this.util(statu)
    },
    shopAddCount(e){
      
      let {itemdata } = e.currentTarget.dataset;
      if (itemdata.discountFlag == true) {
        if (itemdata.number + 1 == itemdata.limitNum + 1) {
          this.setData({
            isHide: true,
            content: `折扣商品限购${itemdata.limitNum}份,超过${itemdata.limitNum}恢复原价`
          })
          setTimeout(() => {
            this.setData({ isHide: false })
          }, 1000)
        }
      }
      if (itemdata.multiKinds == 1){
        addSkuShopCartAction(itemdata, app.store)
      }else{
        addShopCartAction(itemdata, app.store)
      }
    },
    //去结算
    gotoClearing(){
      let openid = wx.getStorageSync('openid');
      let token = wx.getStorageSync('token');
      if (openid && token) {
        wx.navigateTo({
          url: '/pages/ordersubmit/index'
        })
        let value = wx.getStorageSync('cart');
        app.store.dispatch(addSubmitShop(value))
      } else {
        wx.switchTab({
          url: '/pages/account/index'
        })
      }

      this.util("close")
    },
    shopMinusCount(e){
      let { itemdata } = e.currentTarget.dataset;
      if (itemdata.multiKinds == 1) {
        decreaseSkuShopCartAction(itemdata, app.store)
      } else {
        decreaseShopCartAction(itemdata, app.store)
      }
    },
    util: function (currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200, //动画时长 
        timingFunction: "linear", //线性 
        delay: 0 //0则不延迟 
      });

      // 第2步：这个动画实例赋给当前的动画实例 
      //  this.animation = animation;

      // 第3步：执行第一组动画 
      animation.opacity(0).rotateX(-100).step();

      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        // 执行第二组动画 
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
          animationData: animation
        })

        //关闭 
        if (currentStatu == "close") {
            this.setData({
              show: false
            });
        }
      }.bind(this), 200)
      // 显示 
      if (currentStatu == "open") {
          this.setData({
            show: true
          });
      }
    },
  }
})

