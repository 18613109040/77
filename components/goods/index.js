const app = getApp()
import {  goodsSkuListAction} from '../../actions/goods'
import { addSkuShopCartAction, decreaseSkuShopCartAction, addShopCartAction, decreaseShopCartAction} from '../../actions/shopcart'
Component({
  properties: {
    goods: {
      type: Object,
      value:{}
    },
    shopinfo:{
      type: Object,
      value: { }
    },
    isRest:{
      type: Boolean,
      value:false
    },
    color:{
      type: String,
      value: "#FF004C"
    },
    componentType:{
      type:Number,
      value:1
    }
  },
  data: {
    greycolor: app.globalData.greycolor,
    showModalStatus: false,
    goodsSku: [],
    goodsSkuList: {

    },
    isHide:false,
    content:""
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function () {

  },
  ready() {
    app.event.on('addShopCartEvent', this.addShopCart, this);
  },
  //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  moved: function () { 
    
  },
  //组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: function () {
     app.event.off('addShopCartEvent')
     app.event.off('addShopCartEvent', this.addShopCart)
     
  },
  methods: {
    //点击加入购物车 触发事件
    addShopCart(data) {
      if (this.data.showModalStatus==false){
        this.powerDrawer({
          currentTarget: {
            dataset: {
              statu: "open",
              name: data
            }
          }
        })
      }
    },
    
    //减商品
    minusCount(e) {
      let { id, itemdata} = e.currentTarget.dataset;
      //购物车管理
      decreaseShopCartAction(itemdata,app.store)
    
    },

    //增加商品
    addCount(e) {
      let { id, itemdata } = e.currentTarget.dataset;
      if (itemdata.discountFlag == true) {
        if (itemdata.number + 1 == itemdata.limitNum + 1) {
          this.setData({
            isHide: true,
            content: `折扣商品限购${itemdata.limitNum}份,超过${itemdata.number + 1}恢复原价`
          })
          setTimeout(() => {
            this.setData({ isHide: false })
          }, 1000)
        }
      }
      
 
      addShopCartAction(itemdata,app.store)
     
    },
    gotoGoods(e){
      const {  id, groupActivityId } = this.data.goods

      wx.navigateTo({
        url:`/pages/commodityDetails/index?id=${this.data.goods.id}`,
      })
    },
    //加入购物车
    addCart() {
      this.setData({
        goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number + 1 }),
      })
      addSkuShopCartAction(Object.assign({}, this.data.modelData,{
        attrIds: this.data.goodsSkuList.attrIds,
        attrValues: this.data.goodsSkuList.attrValues,
        price: this.data.goodsSkuList.price,
        discountPrice: this.data.goodsSkuList.discountPrice,
        skuSalenum: this.data.goodsSkuList.skuSalenum,
        skuStock: this.data.goodsSkuList.skuStock,
        skuid: this.data.goodsSkuList.skuid,
        noshop: this.data.goodsSkuList.noshop
      }), app.store)
     
    },
    //sku 加
    skuAddCount(){
     
      if (this.data.modelData.discountFlag==true){
        if (this.data.goodsSkuList.number + 1 == this.data.modelData.limitNum+1){
          this.setData({
            isHide: true,
            content: `折扣商品限购${this.data.modelData.limitNum}份,超过${this.data.modelData.limitNum}恢复原价`
          })
          setTimeout( ()=> {
            this.setData({isHide: false })
          }, 3000)
        }
      }
      this.setData({
        goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number + 1 }),
      })
      
      addSkuShopCartAction(Object.assign({}, this.data.modelData, {
        attrIds: this.data.goodsSkuList.attrIds,
        discount: this.data.goodsSkuList.discount,
        discountFlag: this.data.goodsSkuList.discountFlag,
        discountPrice: this.data.goodsSkuList.discountPrice,
        attrValues: this.data.goodsSkuList.attrValues,
        price: this.data.goodsSkuList.price,
        skuSalenum: this.data.goodsSkuList.skuSalenum,
        skuStock: this.data.goodsSkuList.skuStock,
        skuid: this.data.goodsSkuList.skuid,
        noshop: this.data.goodsSkuList.noshop
      }), app.store)
     
    },
    //sku 减
    skuMinusCount(){
      this.setData({
        goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number - 1 }),
      })
      decreaseSkuShopCartAction(Object.assign({}, this.data.modelData, {
        attrIds: this.data.goodsSkuList.attrIds,
        attrValues: this.data.goodsSkuList.attrValues,
        price: this.data.goodsSkuList.price,
        discountPrice: this.data.goodsSkuList.discountPrice,
        skuSalenum: this.data.goodsSkuList.skuSalenum,
        skuStock: this.data.goodsSkuList.skuStock,
        skuid: this.data.goodsSkuList.skuid,
        noshop: this.data.goodsSkuList.noshop
      }), app.store)
     
    },
    //点击sku
    clickSku(e) {
      let { name, type } = e.currentTarget.dataset;
      let temp = this.data.goodsSkuList.skulist;
      temp.map(item => {
        if (item.name == type) {
          item.value.map(d => {
            if (d.title == name) {
              d.check = true
            } else {
              d.check = false
            }
          })
        }
      })
      let str = ""
      temp.map(item => {
        item.value.map(d => {
          if (d.check == true) {
            if (str == "") {
              str = item.name + ":" + d.title
            } else {
              str = str + ";" + item.name + ":" + d.title
            }
          }
        })
      })
      let skutmp = this.data.goodsSku.filter(item => item.attrValues == str)
      if (skutmp.length > 0) {
        let value = wx.getStorageSync('cart');
        let temData = value || [];
        if (temData.filter(item => item.multiKinds == 1 && item.id == this.data.goodsSkuList.id && skutmp[0].id == item.skuid).length > 0) {
         
          this.setData({
            goodsSkuList: Object.assign(this.data.goodsSkuList, {
              skulist: temp,
              discount: skutmp[0].discount,
              discountFlag: skutmp[0].discountFlag,
              discountPrice: skutmp[0].discountPrice,
              attrIds: skutmp[0].attrIds,
              skuid: skutmp[0].id,
              price: skutmp[0].price,
              skuSalenum: skutmp[0].skuSalenum,
              skuStock: skutmp[0].skuStock,
              attrValues: skutmp[0].attrValues,
              number: temData.filter(item => item.multiKinds == 1 && item.id == this.data.goodsSkuList.id && skutmp[0].id == item.skuid)[0].number,
              noshop: false
            })
          })

        } else {
          this.setData({
            goodsSkuList: Object.assign(this.data.goodsSkuList, {
              skulist: temp,
              attrIds: skutmp[0].attrIds,
              discount: skutmp[0].discount,
              discountFlag: skutmp[0].discountFlag,
              discountPrice: skutmp[0].discountPrice,
              skuid: skutmp[0].id,
              price: skutmp[0].price,
              skuSalenum: skutmp[0].skuSalenum,
              skuStock: skutmp[0].skuStock,
              attrValues: skutmp[0].attrValues,
              noshop: false,
              number: 0
            })
          })

        }

      } else {
        this.setData({
          goodsSkuList: Object.assign(this.data.goodsSkuList, { noshop: true })
        })
      }


    },
    //sku 组合
    skuDiff(data,name) {
      let ary = {}
      let stroeCart = wx.getStorageSync('cart');
      data.map(item => {
        item.attrValues.split(";").map(i => {
          let key = i.split(':')[0];
          let value = i.split(':')[1];
          if (ary[key]) {
            ary[key] = ary[key] + "," + value
          } else {
            ary[key] = value;
          }
        })
      })
      let array = []
      Object.keys(ary).map((item, index) => {
        let temarray = []
        console.dir(ary)
        Array.from(new Set(ary[item].split(","))).map((it, id) => {
          if (id == 0) {
            temarray[id] = {
              title: it,
              check: true
            }
          } else {
            temarray[id] = {
              title: it,
              check: false
            }
          }
        })
        array[index] = {
          name: item,
          value: temarray
        }
      })
      this.setData({
        goodsSkuList: {
          skulist: array,
          discountFlag: data.length > 0 ? data[0].discountFlag : '',
          discount: data.length > 0 ? data[0].discount : '',
          discountPrice: data.length > 0 ? data[0].discountPrice : '',
          attrIds: data.length > 0 ? data[0].attrIds : '',
          skuid: data.length > 0 ? data[0].id : '',
          price: data.length > 0 ? data[0].price : '',
          skuSalenum: data.length > 0 ? data[0].skuSalenum : '',
          skuStock: data.length > 0 ? data[0].skuStock : '',
          attrValues: data.length > 0 ? data[0].attrValues : '',
        //  skuData: data,
          number: stroeCart && stroeCart.filter(item => item.id == name.id && item.multiKinds == 1 && item.skuid == data[0].id).length > 0 ? stroeCart.filter(item => item.id == name.id && item.multiKinds == 1 && item.skuid == data[0].id)[0].number : 0,
          noshop: false,
          id: name.id
        },
        goodsSku: data
      })
    },
    //弹出层
    powerDrawer(e) {
      let { statu, name } = e.currentTarget.dataset;
      if (statu === 'open') {
        goodsSkuListAction({
          id: name.id,
          data: {},
          success: (res) => {
            this.skuDiff(res.result,name)
          }
        })
      }
      this.setData({
        modelData: name
      })
      this.util(statu)
    },
    //弹出层动画
    util: function (currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例
      var animation = wx.createAnimation({
        duration: 200, //动画时长
        timingFunction: "linear", //线性
        delay: 0 //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;

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
          this.setData(
            {
              showModalStatus: false
            }
          );
        }
      }.bind(this), 200)
      // 显示
      if (currentStatu == "open") {
        this.setData(
          {
            showModalStatus: true
          }
        );
      }
    }
  }
})

