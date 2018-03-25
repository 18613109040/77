//index.js
let city = require('../../utils/city.js');
//获取应用实例
let app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    tHeight: 0,
    bHeight: 0,
    startPageY: 0,
    cityList: [],
    scrollTop: 0,
    city: "广州",
  },
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      greycolor: app.globalData.greycolor,
    })
    // 生命周期函数--监听页面加载
    let searchLetter = city.searchLetter;
    let cityList = city.cityList();
    let sysInfo = wx.getSystemInfoSync();
    let winHeight = sysInfo.windowHeight;
    //添加要匹配的字母范围值
    //1、更加屏幕高度设置子元素的高度
    let itemH = winHeight / searchLetter.length;
    let tempObj = [];
    for (let i = 0; i < searchLetter.length; i++) {
      let temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成


  },
  onShow: function () {

  },
  searchStart: function (e) {
    let showLetter = e.currentTarget.dataset.letter;
    let pageY = e.touches[0].pageY;
    this.setScrollTop(this, showLetter);
    this.nowLetter(pageY, this);
    this.setData({
      showLetter: showLetter,
      startPageY: pageY,
      isShowLetter: true,
    })
  },
  searchMove: function (e) {
    let pageY = e.touches[0].pageY;
    let startPageY = this.data.startPageY;
    let tHeight = this.data.tHeight;
    let bHeight = this.data.bHeight;
    let showLetter = 0;
    console.log(pageY);
    if (startPageY - pageY > 0) { //向上移动
      if (pageY < tHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    } else {//向下移动
      if (pageY > bHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    }
  },
  searchEnd: function (e) {
    // console.log(e);
    // var showLetter=e.currentTarget.dataset.letter;
    let that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)

  },
  nowLetter: function (pageY, that) {//当前选中的信息
    let letterData = this.data.searchLetter;
    let bHeight = 0;
    let tHeight = 0;
    let showLetter = "";
    for (let i = 0; i < letterData.length; i++) {
      if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
        bHeight = letterData[i].bHeight;
        tHeight = letterData[i].tHeight;
        showLetter = letterData[i].name;
        break;
      }
    }
    this.setScrollTop(that, showLetter);
    that.setData({
      bHeight: bHeight,
      tHeight: tHeight,
      showLetter: showLetter,
      startPageY: pageY
    })
  },
  bindScroll: function (e) {
    console.log(e.detail)
  },
  setScrollTop: function (that, showLetter) {
    let scrollTop = 0;
    let cityList = that.data.cityList;
    let cityCount = 0;
    let initialCount = 0;
    for (let i = 0; i < cityList.length; i++) {
      if (showLetter == cityList[i].initial) {
        scrollTop = initialCount * 30 + cityCount * 41;
        break;
      } else {
        initialCount++;
        cityCount += cityList[i].cityInfo.length;
      }
    }
    that.setData({
      scrollTop: scrollTop
    })
  },
  //点击城市选中
  bindCity: function (e) {
    let city = e.currentTarget.dataset.city;
    this.setData({
      city: city
    })
    app.event.emit('changecity', city)
    wx.navigateBack();
  }
})
