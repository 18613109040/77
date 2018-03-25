// index.js
const storageKey = 'SEARCH_HISTORY_LIST'
import { getSearchGoodsAction, getListHotKey, emptySearchGoodsAction} from '../../actions/home'
const { connect } = require('../../libs/wechat-weapp-redux.js')
let app = getApp()
const pageConfig = {

  /**
   * 页面的初始数据
   */
  
  data: {
    // 热搜
    windowHeight: "",
    windowWidth: "",
    modelShow:false,
    greycolor: app.globalData.greycolor,
    hotList:[
    '黛莱美', 'BB霜','自然菲','雅素', '5100', '纾雅'
    ],
    load:false,
    goods: [],
    searchKey:"",
    resultstatus:1, 
    currentPage: 1,
    // 历史搜索
    hisList:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: this.data.shopInfo.theme,
      greycolor: app.globalData.greycolor,
    })
    wx.getStorage({
      key:storageKey,
      success:(res)=>{
        this.setData({
          hisList:res.data.filter((item,index)=>index<4)
        })
      },
      fail:()=>{
        console.log('fail')
      }
    })
    getListHotKey({
      data:{},
      success:(res)=>{
        this.setData({
          hotList:res.result
        })
      }
    })
  },
  onShow: function (e) {
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
  },

  onUnload(){
    emptySearchGoodsAction(this)
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
  /**
   * 搜索input输入框 
   */
  onInputSearch:function(e){
    this.setData({
      searchKey: e.detail.value
    })
  },
  /**
   * 点击搜索
   */
  onSearch: function (e) {
      
    if (this.data.searchKey){
      var list = this.data.hisList
      list.unshift({
        key: this.data.searchKey,
        text: this.data.searchKey
      })
      this.setData({
        hisList:list,
        currentPage:1,
        goods:[]
      })  
      // 搜索记录保存到storage
      wx.setStorage({
        key: storageKey,
        data:list,
        success:  ()=>{
          console.log(this)
        },
        fail: function () {
          console.log('fail')
        }
      })
      
      this.getData(this.data.searchKey);

    }
  },
  scrollLower() {
    if (this.data.load) {
      return;
    } else {
      this.getData(this.data.searchKey)
    }

  },
  getData(name) {
    this.setData({
      load: true
    })
    getSearchGoodsAction({
      data: {
        keyWord: name,
        shopId: this.data.shopInfo.id,
        "page.pageSize": 10,
        "page.currentPage": this.data.currentPage,
      },
      success: (res) => {
        if (res.result.totalCount == 0) {
          this.setData({
            load: true,
            goods: [],
            currentPage: this.data.currentPage + 1,
            resultstatus: 3
          })
        } else {
          if (res.result.totalPage <= this.data.currentPage) {
            this.setData({
              load: true,
              currentPage: this.data.currentPage + 1,
              resultstatus: 2
            })
          } else {
            this.setData({
              load: false,
              currentPage: this.data.currentPage + 1,
              resultstatus: 2

            })
          }
        }
      }
    },this)
  },
  //点击历史记录
  clickhis(e){
    let { name } = e.currentTarget.dataset;
    this.setData({
      searchKey: name,

    })
    this.getData(name)
  },
  goToShop(e){
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  },
  /**
   * 清空搜索记录 
   */
  onClearHis:function(){
    wx.removeStorage({
      key: storageKey,
      success:()=>{
        this.setData({
          hisList:[]
        })
      }
    })
  }
}

function mapStateToProps(state) {
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
  state.searchGoods.data.map(item=>{
    let d =state.shopcart.filter(ix => item.multiKinds == 0 && ix.id === item.id)
    if (d.length > 0) {
      item.number = d[0].number
    } else {
      item.number = 0
    }
  })
  return {
    shopInfo: state.shopInfo,
    shopcart: state.shopcart,
    allnumber: number,
    allmoney: parseFloat(allmoney).toFixed(2) ,
    searchGoods: state.searchGoods
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)