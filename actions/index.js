import { fetch, wxRequest} from './fetch.js'
export const GET_PLAT_FROM_LIST_ACTION = "GET_PLAT_FROM_LIST_ACTION" 
//根据经纬度获取附近小店
export function getListShopByL(option) {
  return fetch({
    url: 'shop/selectShopListInfo', //"shop/selectShopList"
    data: option.data,
    success: option.success,
    error: option.error
  })

}
//获取店铺图片
export function getShopImage(option){
  fetch({
    url: 'shop/listImg',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取背景图片
export function getShopgb(option) {
  fetch({
    url: 'resource/list/2',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//地址搜索
export function searchAdress(option){
  fetch({
    url: 'resource/address/suggestion',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
export function getBusinessTypes(option){
  fetch({
    url: 'business/getPlatformList',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取首页分类
export function getPlatformListAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: 'business/getPlatformList',
      ...option
    }).then(json => {
      dispatch({
        type: GET_PLAT_FROM_LIST_ACTION,
        json
      })
    })
  }
}

//获取店铺类型
export function listShopType(option) {
  fetch({
    url: 'shop/listShopType',
    data: option.data,
    success: option.success,
    error: option.error
  })
}

