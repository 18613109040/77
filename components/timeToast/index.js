let app = getApp()
const { connect } = require('../../libs/wechat-weapp-redux.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showTost:{
      type:Boolean,
      value:true
    },
    currentSelect:{
      type: Number,
      value: 0
    },
    deliveryTime: {
      type: Object,
      value: 
        {
          whatDate:"周一",
          deliveryFee:10,
          timeSolts:[{
            timeSolt:"今天 10:13 配送费 20",
            deliveryDate:"2108-01-06 18:11:30",
            check:true
          }, {
            timeSolt: "今天 10:13 配送费 20",
            deliveryDate: "2108-01-06 18:11:30",
            check: false
          }, {
              timeSolt: "10:13",
              deliveryDate: "2108-01-06 18:11:30",
              check:false
          }]
        }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTost: true
  },
  ready(){
   
  },
  /**
   * 组件的方法列表
   */
  methods: {

    bindPickerChange(e){
      console.dir(e)
    }
    
  }
})
