import { fetch } from './fetch.js'
//发表评论
export function postComment(option) {
  fetch({
    url: `api/comment/add`,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取店铺评价统计
export function getCommentTotal(option) {
  fetch({
    url: `shop/totalComment/${option.shopid}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取店铺评价
export function getShopComment(option) {
  fetch({
    url: `shop/listComment`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取用户评论列表
export function getMyCommentList(option){
  fetch({
    url: `api/comment/page`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//获取评价详情
export function getCommentDetail(option) {
  fetch({
    url: `api/comment/get`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//编辑评论
export function getCommentEidt(option) {
  fetch({
    url: `api/comment/edit`,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: option.data,
    success: option.success,
    error: option.error
  })
}