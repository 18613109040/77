
//获取应用实例
var app = getApp();
const { connect } = require('../../libs/wechat-weapp-redux.js')
import { getCategoryList, getCategoryGoods, getGoodsSkuList, getCategoryListAction, clickClassificationAction, clickClassificationTowAction, getCategoryGoodsAction, clickClassifiupdataGoodsAction, getCategoryGoodsDownAction } from '../../actions/classification'
import {  goodsSkuListAction } from '../../actions/goods'
import { addSkuShopCartAction, decreaseSkuShopCartAction, addShopCartAction, decreaseShopCartAction } from '../../actions/shopcart'
const pageConfig = {
  data: {
    load: false,
    scrollTop: 0,
    modelShow: false,
    windowWidth:"",
    theme: "#FF004C",
    showModalStatus:false
  },
  onShow: function (e) {
    new app.ToastPannel();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    if (this.data.classification.length>0){
      let isselectid = wx.getStorageSync("selectId");
      if (isselectid) {
        this.clickShow({
          currentTarget: {
            dataset: {
              name: Object.assign({}, this.data.classification.filter(item => item.id === isselectid)[0], { select: false })
            }
          }
        })
        let index = this.data.classification.findIndex(item => item.id === isselectid);
        this.setData({
          scrollTop: index * 35
        })
      }
      wx.removeStorageSync("selectId")
    }else{
      this.getInintData()
    }
  },
  //监听页面加载
  onLoad: function (options) {
    this.setData({
      color: this.data.shopInfo.theme,
      greycolor: app.globalData.greycolor,
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    
  },
  //获取初始信息
  getInintData(){
    getCategoryListAction({
      shopid: this.data.shopInfo.id,
      data: {},
      success: (res) => {
        if (res.errorCode == 0) {
          let isselectid = wx.getStorageSync("selectId");
          if (isselectid) {
            setTimeout(() => {
              this.clickShow({
                currentTarget: {
                  dataset: {
                    name: Object.assign({}, res.result.filter(item => item.id === isselectid)[0], { select: false })
                  }
                }
              })
              let index = res.result.findIndex(item => item.id === isselectid);
              this.setData({
                scrollTop: index * 35
              })
            }, 100)
            wx.removeStorageSync("selectId")
          } else {
            if (res.result[0].childs && res.result[0].childs.length > 0) {
              getCategoryGoodsAction({
                data: {
                  categoryId: res.result[0].childs[0].id,
                  "page.pageSize": 10,
                  "page.currentPage": 1,
                  shopId: this.data.shopInfo.id
                }
              }, this)
            } else {
              getCategoryGoodsAction({
                data: {
                  categoryId: res.result[0].id,
                  "page.pageSize": 10,
                  "page.currentPage": 1,
                  shopId: this.data.shopInfo.id
                }
              }, this)
            }
          }
         
        }
      }
    }, this)
  },
  gotoGoods(e){
    const { itemdata } = e.currentTarget.dataset
    wx.navigateTo({
      url:  `/pages/commodityDetails/index?id=${itemdata.id}`,
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
  //下拉加载数据
  scrollLower() {
    Object.keys(this.data.classificationGoods).map(item => {
      if (this.data.classificationGoods[item].select == true) {
        if (this.data.classificationGoods[item].data.length < this.data.classificationGoods[item].totalCount) {
          if (this.data.load == false) {
            this.setData({
              load: true
            })
            getCategoryGoodsDownAction({
              data: {
                categoryId: item,
                "page.pageSize": 10,
                "page.currentPage": this.data.classificationGoods[item].data.length / 10 + 1
              },
              success: (res) => {
                this.setData({
                  load: false
                })
              }
            }, this)
          }
        }
      }
    })

  },
  //点击一级分类
  clickShow(e) {
    let { id, name } = e.currentTarget.dataset;
    clickClassificationAction(name, this)
    if (name.childs && name.childs.length > 0) {
      clickClassificationTowAction(name.childs[0], this)
      if (this.data.classificationGoods[name.childs[0].id]) {
        clickClassifiupdataGoodsAction(name.childs[0], this)
      } else {
        getCategoryGoodsAction({
          data: {
            categoryId: name.childs[0].id,
            "page.pageSize": 10,
            "page.currentPage": 1,
            shopId: this.data.shopInfo.id
          }
        }, this)
      }
    } else {
      if (this.data.classificationGoods[name.id]) {
        clickClassifiupdataGoodsAction(name, this)
      } else {
        getCategoryGoodsAction({
          data: {
            categoryId: name.id,
            "page.pageSize": 10,
            "page.currentPage": 1,
            shopId: this.data.shopInfo.id
          }
        }, this)
      }
    }
  },
  //点击二级分类
  listClickBar(e) {
    let { id, item } = e.currentTarget.dataset;
    clickClassificationTowAction(item, this)
    if (this.data.classificationGoods[item.id]) {
      clickClassifiupdataGoodsAction(item, this)
    } else {
      getCategoryGoodsAction({
        data: {
          categoryId: item.id,
          "page.pageSize": 10,
          "page.currentPage": 1,
          shopId: this.data.shopInfo.id
        }
      }, this)
    }
  },
  //减商品
  minusCount(e) {
    let { id, itemdata } = e.currentTarget.dataset;
    //购物车管理
    decreaseShopCartAction(itemdata, app.store)

  },

  //增加商品
  addCount(e) {
    let { id, itemdata } = e.currentTarget.dataset;
    if (itemdata.discountFlag == true) {
      if (itemdata.number + 1 == itemdata.limitNum + 1) {
        this.show(`折扣商品限购${itemdata.limitNum}份,超过${itemdata.number + 1}恢复原价`);
      }
    }
    addShopCartAction(itemdata, app.store)

  },
  //加入购物车
  addCart() {
    this.setData({
      goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number + 1 }),
    })
    addSkuShopCartAction(Object.assign({}, this.data.modelData, {
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
  skuAddCount() {
    if (this.data.modelData.discountFlag == true) {
      let limitnumber = 0
      this.data.shopcart.map(item=>{
        if (item.id == this.data.goodsSkuList.id){
          limitnumber++
        }
      })
      if (limitnumber + 1 == this.data.modelData.limitNum + 1) {
        this.show(`折扣商品限购${this.data.modelData.limitNum}份,超过${this.data.modelData.limitNum}恢复原价`);
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
  skuMinusCount() {
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
  skuDiff(data, name) {
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
          this.skuDiff(res.result, name)
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

function mapStateToProps(state) {
  //统计购物车数量 & 总价
  let number = 0;
  let allmoney = 0
  state.shopcart.map(item => {
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
  let temarray = []
  for (let p in state.classificationGoods) {
    // console.log(p);//   取得是key值
    temarray.push(state.classificationGoods[p]);//取得是value值
  }
  //同步购物车数量
  let temdata = temarray.filter(item => item.select == true).length > 0 ? temarray.filter(item => item.select == true)[0] : { data: [] };
  //同步购物车数量
  // let temdata = Object.values(state.classificationGoods).filter(item => item.select == true).length > 0 ? Object.values(state.classificationGoods).filter(item => item.select == true)[0] : { data: [] };
  if (temdata.data.length > 0) {
    temdata.data.map(item => {
      let d = state.shopcart.filter(ix => item.multiKinds == 0 && ix.id === item.id)
      if (d.length > 0) {
        item.number = d[0].number
      } else {
        item.number = 0
      }
    })
  }
  //分类列表控制
  let classData = state.classification;
  classData.map((item, index) => {
    let d = state.shopcart.filter(ix => ix.categoryId1 === item.id)
    if (d.length > 0) {
      let number1 = 0
      d.map(i => {
        number1 += i.number
      })
      item.number = number1
    } else {
      item.number = 0;
    }
    let da = item.childs || [];
    da.map((ite) => {
      if (state.shopcart.filter(ix => ix.categoryId2 === ite.id).length > 0) {
        ite.check = true
      } else {
        ite.check = false
      }
    })
  })
  return {
    shopcart: state.shopcart,
    allnumber: number,
    shopInfo: state.shopInfo,
    classification: classData,
    classificationGoods: state.classificationGoods,
    currentGoods: temdata,
    allmoney: parseFloat(allmoney).toFixed(2) 
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)