/**
 * 店铺相关接口
 */
import { fetch, wxRequest } from './fetch.js'
export const GET_SHOP_INFO = "GET_SHOP_INFO";
export const GET_SHOP_COMMENT_NUMBER = 'GET_SHOP_COMMENT_NUMBER'
export const GET_TATOAL_SHOP_COMMENT = 'GET_TATOAL_SHOP_COMMENT'
export const GET_HAS_IMAGE_SHOP_COMMENT = 'GET_HAS_IMAGE_SHOP_COMMENT'
export const GET_GOODS_COMMENT_NUMBER = 'GET_GOODS_COMMENT_NUMBER'
export const GET_BAD_COMMENT_NUMBER = 'GET_BAD_COMMENT_NUMBER'
export const EMPTY_COMMENT = 'EMPTY_COMMENT'
export const GET_SHOP_INFO_BY_ID_ACTION = "GET_SHOP_INFO_BY_ID_ACTION"
export const GET_SHOP_REPORT_TYPE = 'GET_SHOP_REPORT_TYPE';

//获取店铺详情
export function getShopInfoByIdAction(option,cb) {
  return (dispatch, getState) => {
    return wxRequest({
      url: 'shop/getById',
      data: option
    }).then(json => {
      cb(json)
      dispatch({
        type: GET_SHOP_INFO_BY_ID_ACTION,
        json
      })
    })
  }
}
//获取店铺信息保存
export function getShopInfoAction(data,that){
  return that.dispatch({
    type: GET_SHOP_INFO,
    json: data
  })
}
export function getShopCommentNumber(option) {
  return dispatch => {
    wxRequest({
      url: `shop/totalComment/${option.shopId}`
    }).then((json) => {
      return dispatch({
        type: GET_SHOP_COMMENT_NUMBER,
        json
      })
    })
  }
}
export function getShopComment(option, callback = (json) => { }) {
  return dispatch => {
    wxRequest({
      url: "shop/listComment",
      data: option
    }).then((json) => {
      callback(json)
      switch (option.type) {
        case 0:
          return dispatch({
            type: GET_TATOAL_SHOP_COMMENT,
            json
          })
        case 1:
          return dispatch({
            type: GET_HAS_IMAGE_SHOP_COMMENT,
            json
          })
        case 2:
          return dispatch({
            type: GET_GOODS_COMMENT_NUMBER,
            json
          })
        case 3:
          return dispatch({
            type: GET_BAD_COMMENT_NUMBER,
            json
          })
        default:
          return {}
      }

    })
  }
}
export function emptyComment(json) {
  return {
    type: EMPTY_COMMENT,
    json
  }
}
/**
 * 获取店铺违规类型
 * 
 */
export function getShopReportType(option) {
  return dispatch => {
    wxRequest({
      url: "common/enums/reportType"
    }).then((json) => {
      return dispatch({
        type: GET_SHOP_REPORT_TYPE,
        json
      })
    })
  }
}

/**
 * 举报商家
 */
export function addReport(option, callback = (json) => { }) {
  wxRequest({
    url: "api/report/add",
    method: "POST",
    data: option
  }).then((json) => {
    callback(json)
  })

}
