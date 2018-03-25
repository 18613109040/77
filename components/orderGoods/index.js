const app = getApp()
Component({
  properties: {
    product: {
      type: Object
    },
    color: {
      type: String,
      value: "#FF004C"
    },
    promotionType:{
      type: Number,
      value: 0
    }
  },
  data: {
    
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function () {

  },
  ready() {
   
  },
  //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  moved: function () { },
  //组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: function () { },
  methods: {

  }
})

