import { fetch } from './fetch.js'
export const GET_CATEGORY_LIST_ACTION = "GET_CATEGORY_LIST_ACTION";
export const CLICK_CLASSIFICATION_ACTION = "CLICK_CLASSIFICATION_ACTION";
export const CLICK_CLASSIFICATION_TOW_ACTION = "CLICK_CLASSIFICATION_TOW_ACTION";
export const GET_CATEGORY_GOODS_ACTION = "GET_CATEGORY_GOODS_ACTION";
export const GET_CATEGORY_GOODS_DOWN_ACTION = "GET_CATEGORY_GOODS_DOWN_ACTION";
export const CLICK_CLASSIFICATION_UPDATA_DOODS_ACTION = "CLICK_CLASSIFICATION_UPDATA_DOODS_ACTION";
export const EMPTY_CATEGORY_LIST_ACTION = "EMPTY_CATEGORY_LIST_ACTION";
export const EMPTY_CATEGORY_GOODS_ACTION = "EMPTY_CATEGORY_GOODS_ACTION";

//获取分类
export function getCategoryList(option) {
  fetch({
    url: `category/getShopCategory/${option.shopid}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取分类
export function getCategoryListAction(option,that) {
  fetch({
    url: `category/getShopCategory/${option.shopid}`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: GET_CATEGORY_LIST_ACTION,
        json: res
      })
    },
    error: option.error
  })
}
//清空分类
export function emptyCategoryListAction(data,that) {
  return that.dispatch({
    type: EMPTY_CATEGORY_LIST_ACTION,
    json: data
  })
}

//点击一级分类
export function clickClassificationAction(data,that){
  return that.dispatch({
    type: CLICK_CLASSIFICATION_ACTION,
    json: data
  })
}

//点击二级分类
export function clickClassificationTowAction(data, that) {
  return that.dispatch({
    type: CLICK_CLASSIFICATION_TOW_ACTION,
    json: data
  })
}
//获取分类商品
export function getCategoryGoodsAction(option,that) {
  fetch({
    url: `category/getCategoryGoods`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: GET_CATEGORY_GOODS_ACTION,
        json: Object.assign({}, res, { id: option.data.categoryId})
      })
    },
    error: option.error
  })
}

//清空分类商品
export function emptyCategoryGoodsAction(data, that) {
  return that.dispatch({
    type: EMPTY_CATEGORY_GOODS_ACTION,
    json: data
  })
}

//获取分类商品 下拉加载
export function getCategoryGoodsDownAction(option, that) {
  fetch({
    url: `category/getCategoryGoods`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: GET_CATEGORY_GOODS_DOWN_ACTION,
        json: Object.assign({}, res, { id: option.data.categoryId })
      })
    },
    error: option.error
  })
}
//点击分类更新商品
export function clickClassifiupdataGoodsAction(data, that){
  return that.dispatch({
    type: CLICK_CLASSIFICATION_UPDATA_DOODS_ACTION,
    json: data
  })
}
// //更新分类数据
// export function updataCategoryListAction(data, that) {
//   return that.dispatch({
//     type: UPDATA_CATEGORY_LIST_ACTION,
//     json: data
//   })
// }

//获取商品
export function getCategoryGoods(option) {
  fetch({
    url: `category/getCategoryGoods`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取商品sku
export function getGoodsSkuList(option) {
  fetch({
    url: `goods/getGoodsSkuList/${option.id}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取商品详情
export function getcommodityDetails(option) {
  fetch({
    url: `goods/getGoodsDetail/${option.id}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//获取商品评价
export function goodsListComment(option) {
  fetch({
    url: `goods/listComment`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//统计商品评论
export function totalGoodsComment(option) {
  fetch({
    url: `goods/totalGoodsComment/${option.id}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}