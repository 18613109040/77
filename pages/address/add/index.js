// order.js
import { alert, getKeyAdress, getSearchAdress } from '../../../utils/util'
import { getAddressById, eidtAddressById, addAddressById } from '../../../actions/address'
import WxValidate from '../../../utils/WxValidate'
let city = require('../../../utils/citiesTowns.js');
let query = {}
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: {

    },
    //showpage: false,
    searchData: {},
    defaultadress: "",
    windowHeight: "",
    windowWidth: "",
    currentPage: 1,
    load: false,
    result: [],//保存补完与提示
    color: app.globalData.color,
    greycolor: app.globalData.greycolor,
    contact: "",
    phone: "",
    title: "",
    houseNumber: "",
    id: 0,
    loading: false,
    checked: 0,
    clickDing: true,
    provinces: [],
    citys: [],
    countys: [],
    showPick: false,
    value: [0, 0, 0]
  },
  changeAdress(data) {
    this.setData({
      searchData: data,
      title: data.title,
    })
  },
  //定位
  clickDingwei() {
    this.setData({
      clickDing: true
    })
  },
  //快递
  clickKuaiDi() {
    this.setData({
      clickDing: false
    })
  },
  //点击地区
  clickQuyu() {
    let provinces = [];
    let citys = [];
    let countys = [];
    city.map(item => {
      provinces.push(item)
    })
    if (this.data.value.length > 0) {
      provinces[this.data.value[0]].childs.map(item => {
        citys.push(item)
      })
      citys[this.data.value[1]].childs.map(ix => {
        countys.push(ix)
      })
    } else {
      provinces[0].childs.map(item => {
        citys.push(item)
      })
      citys[0].childs.map(ix => {
        countys.push(ix)
      })
    }

    this.setData({
      provinces: provinces,
      citys: citys,
      countys: countys,
      showPick: true

    })

  },
  //取消
  cancel() {
    this.setData({
      showPick: false
    })
  },
  enter() {
    let title = this.data.provinces[this.data.value[0]].name + "/" + this.data.citys[this.data.value[1]].name + "/" + this.data.countys[this.data.value[2]].name;
    this.setData({
      showPick: false,
      title: title,
      searchData: {
        title: title,
        province: this.data.provinces[this.data.value[0]].name,
        city: this.data.citys[this.data.value[1]].name,
        district: this.data.countys[this.data.value[2]].name,
        location: {
          lng: 0,
          lat: 0
        },
        address: title.replace(/\//g,''),

      }
    })
  },
  powerDrawer3() {
    this.setData({
      showPick: false
    })
  },
  bindChange(e) {
    const { value } = e.detail;
    let citys = [];
    let countys = [];
    this.data.provinces[value[0]].childs.map(item => {
      citys.push(item)
    })
    citys[value[1]].childs.map(ix => {
      countys.push(ix)
    })
    this.setData({
      citys: citys,
      countys: countys,
      value: value
    })
  },
  onUnload: function () {
    //app.event.off()
    app.event.off('changeAdress')
    app.event.off('changeAdress', this.changeAdress)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    query = option;
    app.event.on('changeAdress', this.changeAdress, this);
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
    this.initValidate();
    app.getCurrentAddress((res) => {
      let optins = {
        value: res.address,
        region: res.city
      }
      getKeyAdress(optins, (res) => {
        this.setData({
          result: res.data
        })
      })

      this.setData({
        defaultadress: res.address,
        markers: {
          iconPath: "../../../images/universal_location_red.png",
          width: 30,
          height: 30,
          latitude: res.location.lat,
          longitude: res.location.lng
        }
      })
    })
    if (query.id) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
      let options = {
        memberId: 1,
        id: query.id
      }
      getAddressById({
        data: options,
        success: (res) => {
          this.setData({
            contact: res.result.contact,
            phone: res.result.phone,
            title: res.result.title,
            houseNumber: res.result.houseNumber,
            eidtData: res.result,
            city: res.result.city,
            checked: res.result.gender,
            searchData: {
              province: res.result.province,
              city: res.result.city,
              district: res.result.area,
              detail: res.result.detail,
              title: res.result.title,
              address: res.result.detail,
              location: {
                lng: res.result.lng,
                lat: res.result.lat
              }
            }
          })
        }
      })
    } else {
      let value = wx.getStorageSync('userInfo')
      if (value) {
        this.setData({
          city: value.city
        })
      }
    }
  },
  scrollLower() {
    if (this.data.load) {
      return;
    } else {
      this.getData()
    }
  },
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  radioChange(e) {
    this.setData({
      checked: e.detail.value
    })
  },

  initValidate() {
    this.validate = new WxValidate({
      contact: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      },
      title: {
        required: true
      },
      houseNumber: {
        required: true
      },
    }, {
        contact: {
          required: '请输入收货人姓名'
        },
        phone: {
          required: '请输入手机号',
          tel: '请输入有效手机号码'
        },
        title: {
          required: '请输入收货地址'
        },
        houseNumber: {
          required: '请输入详细地址'
        },
      })
  },
  //点击地址
  clickAdress() {
    wx.navigateTo({
      url: `/pages/address/mapSelect/index?city=${this.data.city}`
    })
    // this.setData({
    //   showpage: true
    // })
  },
  changeImput(e) {

    let value = e.detail.value;
    let { name } = e.currentTarget.dataset;
    if (name == "contact") {
      this.setData({
        contact: value
      })
    } else if (name == "phone") {
      this.setData({
        phone: value
      })
    } else if (name == 'houseNumber') {
      this.setData({
        houseNumber: value
      })
    }

  },
  // bindAddressInput(e){
  //   let value = e.detail.value;
  //   let optins = {
  //     value: value,
  //     region: this.data.city
  //   }
  //   getKeyAdress(optins, (res) => {
  //     this.setData({
  //       result: res.data
  //     })
  //   })
  // },
  //点击搜索结果
  // clickSuchAdress(e) {
  //   let { name } = e.currentTarget.dataset;
  //   this.setData({
  //     showpage:false,
  //     result: [],
  //     searchData: name,
  //     title:  name.title,
  //   })
  // },
  formSubmit: function (e) {
    if (!this.validate.checkForm(e)) {
      const error = this.validate.errorList[0]
      return alert(error.msg)
    }
    let {clickDing,searchData} = this.data
    let option = {
      contact: e.detail.value.contact,
      phone: e.detail.value.phone,
      gender: e.detail.value.gender,
      title: searchData.title,
      detail: searchData.address,
      houseNumber: e.detail.value.houseNumber,
      isDefault: 1,
      province: searchData.province,
      city: searchData.city,
      area: searchData.district,
      lng: searchData.location.lng,
      lat: searchData.location.lat
    }
    if(clickDing){
      // 如果是定位的
      option.detail = searchData.address
    }else{
      option.detail = searchData.address+e.detail.value.houseNumber
    }
    if (query.id) {
      eidtAddressById({
        data: Object.assign({ id: query.id }, option),
        success: (res) => {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack();
        },
        error: (res) => {

        }
      })

    } else {
      addAddressById({
        data: option,
        success: (res) => {
          wx.showToast({
            title: '新增成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack()
        },
        error: (res) => {

        }

      })
    }

  }

})