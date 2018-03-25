import { confirm ,alert} from '../../utils/util'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allmoney:0,
    windowHeight: "",
    windowWidth:"",
    eidt:false,
    checkAll:true,
    shopInfo:{},
    is_empty:false,
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    goods: [
     
    ]
  },
  onLoad(){
  
    this.setData({
      shopInfo: wx.getStorageSync('shopinfo'),
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
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
    let temmoney = 0;
    //获取本地商品
    let value = wx.getStorageSync('cart');
    let temData = value||[];
    if (value) {
      temData.map(item=>{
        item.check = item.check ? item.check : true
        if (item.check == true) {
          temmoney += item.price * item.number
        }
        item.isTouchMove = false
      })
      wx.setStorageSync('cart', temData)
      this.setData({
        goods: temData,
        is_empty: temData.length>0?false:true,
        checkAll: temData.filter(item => item.check==false).length>0?false:true,
        allmoney: parseFloat(temmoney).toFixed(2)
      })
    }else{
      this.setData({
        is_empty: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.dir("onReady")
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.goods.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      goods: this.data.goods
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.goods.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      goods: that.data.goods
    })
  },
  /**
   * 计算滑动角度
   * start 起点坐标
   * end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    
    confirm({
      content: "确定删除该商品",
      cancelText: "取消",
      ok: () => {
        let { id, skuid } = e.currentTarget.dataset;
        let tem = this.data.goods;
        if (skuid) {
          let index = tem.findIndex(item => item.id == id && skuid == item.skuid);
          tem.splice(index, 1)
        } else {
          tem = tem.filter(item => item.id != id)
        }
        let temmoney = 0;
        tem.map(item => {
          if (item.check == true) {
            temmoney += item.price * item.number
          }
        })
        wx.setStorageSync('cart', {
          cart: tem
        })
        this.setData({
          goods: tem,
          is_empty: tem.length > 0 ? false : true,
          checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
          allmoney: parseFloat(temmoney).toFixed(2)
        })

      }
    })
  },
  //减商品
  minusCount:function(e){
    let { id, skuid} = e.currentTarget.dataset;
    let temmoney = 0;
    let tem = this.data.goods
    tem.map(item => {
      if (skuid != "undefined" && item.skuid == skuid && item.id == id) {
        item.number = item.number - 1;

      } else if (item.id == id && skuid == "undefined") {
        item.number = item.number - 1;
      }
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart',tem)
    this.setData({
      goods: tem,
      allmoney: parseFloat(temmoney).toFixed(2)
    })
  },
  //增加商品
  addCount:function(e){
    let { id,skuid } = e.currentTarget.dataset;
    let tem = this.data.goods;
    let temmoney = 0;

    tem.map(item => {
      if (skuid != "undefined" && item.skuid == skuid && item.id == id) {
        item.number = item.number + 1;


      } else if (item.id == id && skuid == "undefined") {
        item.number = item.number + 1;
      }
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart', tem)
    this.setData({
      goods: tem,
      allmoney: parseFloat(temmoney).toFixed(2) 
    })
  },
  //选中商品
  checkToClick:function(e){
    let { id, skuid} = e.currentTarget.dataset;
    let tem = this.data.goods;
    let temmoney = 0;
    tem.map(item => {
      if (skuid != "undefined" && item.skuid == skuid && item.id == id) {
        item.check = !item.check;
        
      } else if (item.id == id && skuid == "undefined") {
        item.check = !item.check;
      }
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart', {
      cart: tem
    })
    this.setData({
      goods: tem,
      checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
      allmoney: parseFloat(temmoney).toFixed(2) 
    })
  },
  //全选
  checkAll:function(e){
    let tem = this.data.goods;
    let temmoney = 0;
    if (this.data.checkAll){
      tem.map(item => item.check=false)
    }else{
      tem.map(item => item.check = true)
    }
    tem.map(item => {
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart',  tem)
    this.setData({
      goods: tem,
      checkAll: !this.data.checkAll,
      allmoney: parseFloat(temmoney).toFixed(2)  
    })
  },
  //点击编辑
  eidtCart(){
    this.setData({
      eidt:true
    })
  },
  //删除
  deleteCart(){
    confirm({
      content:"确定删除选中商品",
      cancelText:"取消",
      ok:()=>{this.delete()}
    })
  },
  //删除商品
  deleteShop(e){
    confirm({
      content: "确定删除该商品",
      cancelText: "取消",
      ok: () => { 
        let { id, skuid } = e.currentTarget.dataset;
        let tem = this.data.goods;
        if (skuid) {
          let index = tem.findIndex(item => item.id == id && skuid == item.skuid);
          console.dir(index)
          tem.splice(index, 1)
        } else {
          tem = tem.filter(item => item.id != id)
        }
        let temmoney = 0;
        tem.map(item => {
          if (item.check == true) {
            temmoney += item.price * item.number
          }
        })
        wx.setStorageSync('cart', tem)
        this.setData({
          goods: tem,
          is_empty: tem.length > 0 ? false : true,
          checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
          allmoney: parseFloat(temmoney).toFixed(2)  
        })

      }
    })
    

  },
  //删除商品
  delete(){
    let tem = this.data.goods.filter(item => item.check==false)
    wx.setStorageSync('cart',  tem)
    this.setData({
      goods: tem,
      is_empty: tem.length > 0 ? false : true,
      checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
    })
  },
  //完成
  comoentCart(){
    this.setData({
      eidt: false
    })
  },
  //去结算
  goClearing() {
    if(this.data.goods.filter(item => item.check == true).length>0){
      wx.redirectTo({
        url: '/pages/ordersubmit/index'
      })
    }else{
      alert("请选中商品")
    }
    
  },
})