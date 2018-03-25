const app = getApp()
Component({
  properties: {
    commentData: {
      type: Object
    },
    color:{
      type:String,
      value:"#FF004C"
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
    previewImage(e) {
      
      let { id, item } = e.currentTarget.dataset;
      let img = []
      if (item.commentImg1) {
        img.push(item.commentImg1)
      }
      if (item.commentImg2) {
        img.push(item.commentImg2)
      }
      if (item.commentImg3) {
        img.push(item.commentImg3)
      }
      wx.previewImage({
        current: id, // 当前显示图片的http链接
        urls: img // 需要预览的图片http链接列表
      })
    }
  }
})

