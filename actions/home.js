import { fetch, wxRequest} from './fetch.js'
export const GET_HOTGOODS_ACTION = "GET_HOTGOODS_ACTION";
export const ININT_HOTGOODS_ACTION = "ININT_HOTGOODS_ACTION";
export const GET_CAROUSEL_LIST_ACTION = "GET_CAROUSEL_LIST_ACTION";
export const GET_SPECIALS_ACTION = "GET_SPECIALS_ACTION";
export const GET_CLASSIFICATION_ACTION = "GET_CLASSIFICATION_ACTION";
export const GET_SEARCH_GOODS_ACTION = "GET_SEARCH_GOODS_ACTION";
export const EMPTY_SEARCH_GOODS_ACTION = "EMPTY_SEARCH_GOODS_ACTION";
export const GET_SPECIALS_GOODS_ACTION = "GET_SPECIALS_GOODS_ACTION";
export const GET_SHOP_TOP_CATEGORY_ACTION = "GET_SHOP_TOP_CATEGORY_ACTION";

/**
 * 获取首页轮播
 *
 * */
export function getCarouselListAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: "shop/getShopImages",
      data: option
    }).then(json => {
      dispatch({
        type: GET_CAROUSEL_LIST_ACTION,
        json
      })
    })
  }
}
/**
 * 获取首页专题
 */
export function getSpecialsAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: `shop/getSpecials/${option.id}`
    }).then(json => {
      dispatch({
        type: GET_SPECIALS_ACTION,
        json
      })
    })
  }
}

//获取热门商品
export function getHotGoodsAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: "goods/listHotForPage",
      data:option
    }).then(json => {
      dispatch({
        type: GET_HOTGOODS_ACTION,
        json
      })
    })
  }
}
//更新数据
export function inintHotGoodsAction(data, that) {
  return that.dispatch({
    type: ININT_HOTGOODS_ACTION,
    json: data
  })
}
/**
 * 获取首页分类列表
 * 
 */
export function getShopTopCategoryAction(option) {
  return (dispatch, getState) => {
    return wxRequest({
      url: `category/getShopTopCategory/${option.id}`
    }).then(json => {
      dispatch({
        type: GET_SHOP_TOP_CATEGORY_ACTION,
        json
      })
    })
  }
}

//搜索
export function getSearchGoodsAction(option,that) {
  fetch({
    url: 'goods/searchGoodsForPage',
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: GET_SEARCH_GOODS_ACTION,
        json: res
      })
    },
    error: option.error
  })
}
//清空搜索数据
export function emptySearchGoodsAction(that) {
  return that.dispatch({
    type: EMPTY_SEARCH_GOODS_ACTION,
    json: {}
  })
}

//获取店铺详情
export function getShopDetail(option) {
  fetch({
    url: 'shop/getById',
    data: option.data,
    success: option.success,
    error: option.error
  })
}


//获取专题商品
export function getSpecialGoods(option,that) {
  fetch({
    url: `shop/getSpecialGoods/${option.data.id}`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: GET_SPECIALS_GOODS_ACTION,
        json: res
      })
    },
    error: option.error
  })
}

//获取热搜标签
export function getListHotKey(option) {
  fetch({
    url: `resource/listHotKey`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//扫码获取商品信息
export function getGoodsByCode(option) {
  fetch({
    url: `goods/getGoodsByCode`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res)
    },
    error: option.error
  })
}