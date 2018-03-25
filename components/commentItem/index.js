Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    test(e){
console.log(3)
    },
    /**
   * 显示评价图片
   */
  previewImage(e) {
    let { id } = e.currentTarget.dataset;
    const { item} = this.data;
    console.log(id)
    console.log(item)
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
