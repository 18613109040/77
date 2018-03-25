// components/backTop/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: {
      type: String,
      value: "#FF004C"
    },
    showTop:{
      type: Boolean,
      value: false
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
    backTop(){
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})
