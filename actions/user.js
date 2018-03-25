import { fetch } from './fetch.js'
//获取授权 code
export function getOpenid(option) {
  fetch({
    url: 'wechat/wxlogin_jscode',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })

}

//获取用户信息
export function getUserInfo(option) {
  fetch({
    url: 'wechat/decodeUserInfo',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })

}

//获取手机验证码
// export function getCode(){
//   fetch({
//     url: 'wechat/decodeUserInfo',
//     method: "POST",
//     data: option.data,
//     success: option.success,
//     error: option.error
//   })

// }

//用户注册
export function register(option){
  fetch({
    url: 'wechat/wechatRegister',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取用户信息
export function getUser(option) {
  fetch({
    url: 'api/user/get',
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//获取微信信息
export function decodeUserInfo(option) {
  fetch({
    url: 'wechat/decodeUserInfo',
    data: option.data,
    success: option.success,
    error: option.error
  })
}


//退出登陆
export function longinOut(option){
  fetch({
    url: 'api/user/removeXcxUser',
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//发送验证码
export function sendCode(option){
  fetch({
    url: 'sms/registerCode',
    data: option.data,
    method: "POST",
    success: option.success,
    error: option.error
  })
}

//编辑用户信息
export function eidtUser(option) {
  fetch({
    url: 'api/user/updateUser',
    data: option.data,
    method: "POST",
    success: option.success,
    error: option.error
  })
}

//获取常见问题
export function getProblem(option) {
  fetch({
    url: 'article/listCategoryByType',
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//获取常见问题
export function listForPage(option) {
  fetch({
    url: 'article/listForPage',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//问题详细内容
export function getProblemById(option) {
  fetch({
    url: 'article/getById',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//意见反馈
export function addReport(option) {
  fetch({
    url: 'api/report/add',
    data: option.data,
    method:'post',
    success: option.success,
    error: option.error
  })
}

//统计用户进入店铺
export function visitShop(option){
  fetch({
    url: 'shop/visitShop',
    data: option.data,
    method: 'post',
    success: option.success,
    error: option.error
  })

}
//微信电话号码注册
export function registerXcxPhone(option) {
  fetch({
    url: 'wechat/registerXcxPhone',
    data: option.data,
    method: 'post',
    success: option.success,
    error: option.error
  })

}
