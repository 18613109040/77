const app = getApp()
Component({
  properties: {
     shopinfo: {
       type: Object
     }
  },
  data: {
     
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function () {
    
  },
  ready(){
    
  },
  //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  moved: function () { },
  //组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: function () { },
  methods: {
    goToShopByMap() {
      let { shopinfo } = this.data
      wx.openLocation({
        latitude: shopinfo.latitude,
        longitude: shopinfo.longitude,
        scale: 28,
        name: shopinfo.name,
        address: shopinfo.address
      })
    }
  }
})

