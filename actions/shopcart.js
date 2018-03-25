/**
 *本地购物车数据操作
 */

export const ADD_SHOP_CQART = "ADD_SHOP_CQART";
export const ADD_SKU_SHOP_CQART = "ADD_SKU_SHOP_CQART";
export const DECREASE_SHOP_CART_ACTION = "DECREASE_SHOP_CART_ACTION";
export const DECREASE_SKU_SHOP_CART_ACTION = "DECREASE_SKU_SHOP_CART_ACTION";
export const DELETE_SKU_SHOP_CART_ACTION = "DELETE_SKU_SHOP_CART_ACTION";
export const DELETE_SHOP_CART_ACTION = "DELETE_SHOP_CART_ACTION";
export const CLRAE_SHOP_CART_ACTION = "CLRAE_SHOP_CART_ACTION";
export const UPDATA_CART_ACTION = "UPDATA_CART_ACTION" //扫码增加商品

export function updataShopCartAction(data, that) {
  return that.dispatch({
    type: UPDATA_CART_ACTION,
    json: data
  })
}
//添加商品  无sku
export function addShopCartAction(data, that) {
  return that.dispatch({
    type: ADD_SHOP_CQART,
    json: data
  })
}

//添加商品  有sku
export function addSkuShopCartAction(data, that) {
  return that.dispatch({
    type: ADD_SKU_SHOP_CQART,
    json: data
  })
}

//减少商品  无sku
export function decreaseShopCartAction(data, that) {
  return that.dispatch({
    type: DECREASE_SHOP_CART_ACTION,
    json: data
  })
}


//减少商品  有sku
export function decreaseSkuShopCartAction(data, that) {
  return that.dispatch({
    type: DECREASE_SKU_SHOP_CART_ACTION,
    json: data
  })
}

//删除商品 有sku
export function deleteSkuShopCartAction(data, that) {
  return that.dispatch({
    type: DELETE_SKU_SHOP_CART_ACTION,
    json: data
  })
}

//删除商品 无sku
export function deleteShopCartAction(data, that) {
  return that.dispatch({
    type: DELETE_SHOP_CART_ACTION,
    json: data
  })
}
//清空购物车
export function clearShopCartAction(data, that) {
  return that.dispatch({
    type: CLRAE_SHOP_CART_ACTION,
    json: data
  })
}
