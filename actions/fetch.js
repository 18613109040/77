import { host } from '../config.js'

const promisify = require('../libs/promisify')
const request = promisify(wx.request);
const checkSession = promisify(wx.checkSession)
const WxLogin = promisify(wx.login)
//用户超时 通过code 换取openid
function vaildation() {
  WxLogin().then(res => {
    var shopinfo = wx.getStorageSync('shopinfo')
    if (res.code) {
      request({
        url: `${host}/wechat/wxlogin_jscode`,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          code: res.code,
          shopId: 74//shopinfo.id
        }
      }).then(response => {
        let data = response.data;
        if (data.result) {
          wx.setStorageSync("openid", data.result.openid);
          wx.setStorageSync("token", data.result.token);
          wx.setStorageSync("uid", data.result.uid);
          wx.setStorageSync("thridSessionKey", data.result.thridSessionKey)
        }
        wx.removeStorageSync('userInfo')
        //  wx.switchTab({
        //    url: '/pages/account/index'
        //  })
      }).fail(res => {
        console.log('获取用户登录态失败！' + res.errMsg)
      })
    }
  })
}

//thridSessionKey 超时
function wxLoginThridSessionKey() {
  checkSession().then(res => {
    request({
      url: `${host}/wechat/wxlogin_thridSessionKey`,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        thridSessionKey: wx.getStorageSync("thridSessionKey")
      }
    }).then(response => {
      let resp = response.data;
      //用户已登录 
      if (resp.errorCode == 0) {
        wx.setStorageSync("openid", resp.result.openid);
        wx.setStorageSync("token", resp.result.token);
        wx.setStorageSync("uid", resp.result.uid);
        wx.removeStorageSync('userInfo')
        wx.switchTab({
          url: '/pages/account/index'
        })
      } else {
        vaildation()
      }
    }).fail(res => {
      vaildation()
    })
  })
}

export function wxRequest(options) {
  let token = wx.getStorageSync('token');
  let uid = wx.getStorageSync('uid')
  let params = {
    url: `${host}/${options.url}`,
    data: options.data,
    method: options.method || 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "Shop-Token": token,
      "Shop-UID": uid,
      ...options.header
    }
  }
  return new Promise((resolve, reject) => {
    wx.request(
      Object.assign({
        ...params,
        success: (res) => {
          wx.hideLoading()
          const data = res.data
          //api拦截请求
          if (data.errorCode == 1) {
            // @thridSessionKey 验证thridSessionKey是否有效
            if (wx.getStorageSync("thridSessionKey")) {
              wxLoginThridSessionKey();
            } else {
              //用户超时 重新校验
              vaildation()
            }
          }
          resolve(res.data)
        },
        fail: reject
      })
    )
  })
}


const getHeaders = ()=>{
  let token = wx.getStorageSync('token')||'8c16decebc8440c7a6116d1001805e3d';
  let uid = wx.getStorageSync('uid')||"16"
  let headers = {
    'content-type': 'application/x-www-form-urlencoded',
    "Shop-Token": token,
    "Shop-UID": uid,
  }
  return headers
}




export function fetch(options) {
  wx.showLoading({
    title: '加载中',
  })
  let token = wx.getStorageSync('token');
  let uid = wx.getStorageSync('uid')

  let optionHeader = options.header||{}
  let headers = { ...getHeaders(), ...optionHeader}
  wx.request({
    url: `${host}/${options.url}`,
    data: options.data,
    method: options.method || 'GET',
    header: headers,
    success: function (res) {
      wx.hideLoading()
      const data = res.data
      if (data.errorCode === 0) {
        options.success && options.success(data)

      } else if (data.errorCode === 1) {
        //回话超时
        if (wx.getStorageSync("thridSessionKey")) {
          wx.checkSession({
            success: function () {
              wx.request({
                url: `${host}/wechat/wxlogin_thridSessionKey`,
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  thridSessionKey: wx.getStorageSync("thridSessionKey")
                },
                success: (response) => {
                  //用户已登录 
                  if (response.data.errorCode == 0) {
                    wx.setStorageSync("openid", response.data.result.openid);
                    wx.setStorageSync("token", response.data.result.token);
                    wx.setStorageSync("uid", response.data.result.uid);
                    wx.removeStorageSync('userInfo')
                    wx.switchTab({
                      url: '/pages/account/index'
                    })
                  } else {
                    vaildation()

                  }
                },
                error: (res) => {
                  console.debug(res)
                }
              })
            },
            fail: function () {

              vaildation()
            }
          })
        } else {
          vaildation()
        }
      } else {
        options.error && options.error(data)
      }
      options.complete && options.complete()
    },
    fail: (res) => {
      console.dir(res)
    }
  })
}

export function get(options, reducersConnect = (json) => {
}) {
  wx.showLoading({
    title: '加载中',
  })
  let optionHeader = options.header||{}
  let headers = { ...getHeaders(), ...optionHeader}
  return dispatch => {
    wx.request({
      url: `${host}/${options.url}`,
      data: options.data,
      method: 'GET',
      header: headers,
      success: function (res) {
        wx.hideLoading()
        const data = res.data

        if (data.errorCode === 0) {
          dispatch(reducersConnect(data))
          options.success && options.success(data)
        } else if (data.errorCode == 1) {
          //回话超时
          if (wx.getStorageSync("thridSessionKey")) {
            wx.checkSession({
              success: function () {
                wx.request({
                  url: `${host}/wechat/wxlogin_thridSessionKey`,
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    thridSessionKey: wx.getStorageSync("thridSessionKey")
                  },
                  success: (response) => {
                    //用户已登录 
                    if (response.data.errorCode == 0) {
                      wx.setStorageSync("openid", response.data.result.openid);
                      wx.setStorageSync("token", response.data.result.token);
                      wx.setStorageSync("uid", response.data.result.uid);
                      wx.removeStorageSync('userInfo')
                      wx.switchTab({
                        url: '/pages/account/index'
                      })
                    } else {
                      vaildation()
                    }
                  },
                  error: (res) => {
                    console.debug(res)
                  }
                })
              },
              fail: function () {

                vaildation()
              }
            })
          } else {
            vaildation()
          }
        } else {
          options.error && options.error(data)
        }
      },
      fail: (res) => {
        options.error && options.error(data)
      }
    })
  }
}

export function post(options, reducersConnect = (json) => {
}) {
  wx.showLoading({
    title: '加载中',
  })
  let optionHeader = options.header||{}
  let headers = { ...getHeaders(), ...optionHeader}
  return dispatch => {
    wx.request({
      url: `${host}/${options.url}`,
      data: options.data,
      method: 'POST',
      header: headers,
      success: function (res) {
        wx.hideLoading()
        const data = res.data
        if (data.errorCode === 0) {
          dispatch(reducersConnect(data))
          options.success && options.success(data)
        } else if (data.errorCode == 1) {
          //回话超时

          if (wx.getStorageSync("thridSessionKey")) {
            wx.checkSession({
              success: function () {
                wx.request({
                  url: `${host}/wechat/wxlogin_thridSessionKey`,
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    thridSessionKey: wx.getStorageSync("thridSessionKey")
                  },
                  success: (response) => {

                    //用户已登录 
                    if (response.data.errorCode == 0) {
                      wx.setStorageSync("openid", response.data.result.openid);
                      wx.setStorageSync("token", response.data.result.token);
                      wx.setStorageSync("uid", response.data.result.uid);
                      wx.removeStorageSync('userInfo')
                      wx.switchTab({
                        url: '/pages/account/index'
                      })
                    } else {
                      vaildation()

                    }
                  },
                  error: (res) => {
                    console.debug(res)
                  }
                })
              },
              fail: function () {
                vaildation()
              }
            })
          } else {
            vaildation()
          }
        } else {
          options.error && options.error(data)
        }
      },
      fail: (res) => {
        options.error && options.error(data)
      }
    })
  }
}