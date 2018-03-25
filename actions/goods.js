/**
 *购物车管理
 */
import { fetch } from './fetch.js'
export const DECREASE_GOODS_ACTION = "DECREASE_GOODS_ACTION";
export const EMPTY_GOODS_ACTION = "EMPTY_GOODS_ACTION";
export const ADD_SKU_GOODS_ACTION = "ADD_SKU_GOODS_ACTION";
export const DELETE_SKU_GOODS_ACTION = "DELETE_SKU_GOODS_ACTION";
export const DECREASE_SKU_GOODS_ACTION = "DECREASE_SKU_GOODS_ACTION";
export const GOODS_SKU_LIST_ACTION = "GOODS_SKU_LIST_ACTION";
export const CHANGE_GOODS_SKU_ACTION = "CHANGE_GOODS_SKU_ACTION";
export const SHOP_DETAILS_ACTION = "SHOP_DETAILS_ACTION";



//删除商品
export function deleteGoodsAction(data, that) {
  return that.dispatch({
    type: DECREASE_GOODS_ACTION,
    json: data
  })
}

//添加商品 有sku
export function addSkuGoodsAction(data, that) {
  return that.dispatch({
    type: ADD_SKU_GOODS_ACTION,
    json: data
  })
}
//减少商品 有sku
export function decreaseSkuGoodsAction(data, that) {
  return that.dispatch({
    type: DELETE_SKU_GOODS_ACTION,
    json: data
  })
}

//删除商品 有sku
export function deleteSkuGoodsAction(data, that) {
  return that.dispatch({
    type: DECREASE_SKU_GOODS_ACTION,
    json: data
  })
}



//清空购物车
export function emptyGoodsAction(data, that) {
  return that.dispatch({
    type: EMPTY_GOODS_ACTION,
    json: data
  })
}

//获取商品sku
export function goodsSkuListAction(option) {
  return fetch({
    url: `goods/getGoodsSkuList/${option.id}`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
    },
    error: option.error
  })
}

//点击sku
export function chengeGoodSkuAction(data, that) {
  return that.dispatch({
    type: CHANGE_GOODS_SKU_ACTION,
    json: data
  })
}

//获取商品详情
export function shopDetailsAction(option,that){
  fetch({
    url: `goods/getGoodsDetail/${option.id}`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: SHOP_DETAILS_ACTION,
        json: res
      })
    },
    error: option.error
  })
}