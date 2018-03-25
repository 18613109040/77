/**
 * 平台首页接口
 */
import { wxRequest } from './fetch.js'
export const GET_PLAT_FROM_LIST_ACTION = "GET_PLAT_FROM_LIST_ACTION" 
export const GET_PLAT_FROM_CAROUSEL_ACTION = "GET_PLAT_FROM_CAROUSEL_ACTION"
export const GET_SHOP_BY_LAT_AND_LONG_ACTION = "GET_SHOP_BY_LAT_AND_LONG_ACTION"
export const EMPTY_SHOP_LIST_ACTION = "EMPTY_SHOP_LIST_ACTION"

//获取首页分类
export function getPlatformListAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: 'business/getPlatformList',
      data: option
    }).then(json => {
      dispatch({
        type: GET_PLAT_FROM_LIST_ACTION,
        json
      })
    })
  }
}

//获取轮播图
export function getPlatfromCarouselAction(option){
  return (dispatch, getState) => {
    return wxRequest({
      url: 'resource/list/2',
      data: option
    }).then(json => {
      dispatch({
        type: GET_PLAT_FROM_CAROUSEL_ACTION,
        json
      })
    })
  }
}

//根据经纬度获取附近小店 
export function getShopByLatAndLongAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: 'shop/selectShopListInfo',
      data:option
    }).then(json => {
      dispatch({
        type: GET_SHOP_BY_LAT_AND_LONG_ACTION,
        json
      })
    })
  }
}

//清空小店数据
export function emptyShopListAction(json){
  return {
    type:EMPTY_SHOP_LIST_ACTION,
    json
  }
}