/**
 * 评分组件
 * @disabled 是否能点击
 * @size 大小
 * @value 值
 * @count 图形数量
 * @allowHalf 是否可以选中半个 @TODO
 * @character class 
 */
Component({
  properties: {
    disabled: {
      type: Boolean,
      value: false
    },
    size:{
      type: Number,
      value: 14
    },
    value:{
      type:Number,
      value:0
    },
    count:{
      type:Number,
      value:5
    },
    allowHalf:{
      type:Boolean,
      value:true
    },
    character:{
      type:String,
      value:"star"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rateclass:"",
    starts:[]
  },

  ready() {
    
    let { value, count, starts} = this.data;
    for (let index = 0; index < count;index++){
      starts.push({
        name: `rate-${Math.round((value - index) * 10)}`
      })
    }
    this.setData({
      starts: starts
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击评论图标
    onChange(e){
      // console.dir(e.currentTarget)

      // return ;
      const { disabled, starts, value} = this.data;
      if (!disabled){
        return ;
      }
      let { index } = e.currentTarget.dataset;
      this.setData({
        value:index+1
      })
    }
  }
})
