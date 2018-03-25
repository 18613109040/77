// pages/report/index.js
import { host } from '../../config'
import { alert } from '../../utils/util'
const { connect } = require('../../libs/wechat-weapp-redux.js')
import { getShopReportType, addReport } from '../../actions/shop'
import * as wxApi from '../../utils/wxApi'
const pageConfig = {
  /**
   *@sheetAction {Bool} 违规内容弹出层标识
   *@actionSheetHidden {Bool} 选择图片弹出层标识
   *@showModalStatus {Bool} 成功提示框标识
   *@chooseType {Number} 违规选中索引
   *@imageUrls {Array} 提交图片地址
   */
  data: {
    sheetAction: false,
    actionSheetHidden: true,
    showModalStatus: false,
    chooseType: -1,
    imageUrls: [],
    actionSheetItems: ['相机拍摄', '相册'],
    animationData: {},
  },

  /**
   * 显示违规内容
   */
  onShowCall() {

    this.setData({
      sheetAction: !this.data.sheetAction
    })
  },
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.shopInfo.theme
    })
  },
  /**
   * 获取违规内容
   */
  onLoad() {
    this.dispatch(getShopReportType())
  },
  /**
   * 选中违规内容
   * 
   */
  selectRedio(e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      chooseType: index,
    })
  },


  // 隐藏动画
  closeMaskAnimation() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in',
    })
    this.animation = animation
    animation.translateY(0).step();
    this.setData({
      animationData: animation.export()
    })
    this.animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(() => {
      this.setData({
        sheetAction: false,
      })
    }, 500)
  },
  /**
   * 显示违规内容
   */
  onShowCall() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out',
    })
    this.animation = animation
    animation.translateY(330).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      this.animation.translateY(0).step();
      this.setData({
        animationData: animation.export()
      })
    }, 300)
    this.setData({
      sheetAction: true,
    })
  },
  /**
   * 上传图片
   */
  bindTap(e) {
    let { name } = e.currentTarget.dataset;
    wxApi.chooseImage(name, (res) => {
      let { imageUrls } = this.data;
      imageUrls.push(res)
      this.setData({
        imageUrls: imageUrls
      })
    })
    this.setData({
      actionSheetHidden: true
    })
  },
  /**
   * 点击上传图片按键
   */
  onChangeImage() {
    this.setData({
      actionSheetHidden: false,
    })
  },
  /**
   * 提交数据
   */
  bindFormSubmit(e) {
    let { imageUrls, chooseType, shopInfo } = this.data;
    console.dir(shopInfo)
    if (chooseType == -1) {
      wx.showToast({
        title: '请选择违规类型',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.content == '') {
      wx.showToast({
        title: '请填写补充信息',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let data = {
      content: e.detail.value.content,
      imageUrls,
      reportType: chooseType,
      shopId: shopInfo.id,
      type: 0
    }
    addReport(data, (res) => {
      console.dir(res)
      if (res.errorCode == 0) {
        this.setData({
          showModalStatus: true
        })
      }
    })
  },
  powerDrawer(e) {
    let { statu } = e.currentTarget.dataset;
    this.util(statu)
  },
  actionSheetChange() {
    this.setData({
      actionSheetHidden: true
    })
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
            showModalStatus: false,
          }
        );
        wx.navigateBack();
        console.log("qqq")
      }
    }.bind(this), 200)

  },
  //删除图片
  clearImg(e) {
    let { index } = e.currentTarget.dataset;
    let { imageUrls } = this.data
    imageUrls.splice(index, 1);
    this.setData({
      imageUrls
    })
  }
}
function mapStateToProps(state) {
  return {
    shopInfo: state.shopInfo,
    shopReportType: state.shopReportType
  }
}
const nextPageConfig = connect(mapStateToProps)(pageConfig)
Page(nextPageConfig)