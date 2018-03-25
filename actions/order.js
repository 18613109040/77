import { fetch, get, post } from './fetch.js'
export const GET_ORDER_LIST_ACTION = "GET_ORDER_LIST_ACTION";
export const EMPTY_ORDER_LIST_ACTION = "EMPTY_ORDER_LIST_ACTION";
export const GET_SHOP_PAY = "GET_SHOP_PAY";
export const GET_DELIVERY_TIME = "GET_DELIVERY_TIME";
export const ORDER_ADRESS_LIST = "ORDER_ADRESS_LIST";
export const ADD_SUBMIT_SHOP = "ADD_SUBMIT_SHOP";
export const GET_PROMOTION_MONEY = "GET_PROMOTION_MONEY";
export const UPDATA_DELIVERY_TIME = "UPDATA_DELIVERY_TIME";
export const CHANGE_SHOP_PAY = "CHANGE_SHOP_PAY";
export const CHANGE_PAY_TYPE = "CHANGE_PAY_TYPE";
export const CHANGE_ADDRESS = "CHANGE_ADDRESS";
export const SPELL_GROUP = "SPELL_GROUP";
export const ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER";
export const GET_GROUP_MEMBER_ORDER_ACTION = "GET_GROUP_MEMBER_ORDER_ACTION";
export const CHANGE_ORDER_STATUS = "CHANGE_ORDER_STATUS";
export const WX_GROUP_PAY = "WX_GROUP_PAY";
export const GET_GROUP_MEMBER_ORDER_DETAIL_ACTION = "GET_GROUP_MEMBER_ORDER_DETAIL_ACTION";
export const GET_GROUP_DETAILS = "GET_GROUP_DETAILS";
export const EMPTY_SHOP_PAY = "EMPTY_SHOP_PAY";

//提交订单
export function postOrder(option) {
  fetch({
    url: `api/order/add`,
    method: "POST",
    header: {
      'content-type': 'application/json'
    },
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//订单列表
export function getOrderList(option) {
  fetch({
    url: `api/order/page`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//获取订单列表
export function getOrderListAction(option,that) {
  fetch({
    url: `api/order/page`,
    data: option.data,
    success: (res) => {
      option.success && option.success(res);
      return that.dispatch({
        type: GET_ORDER_LIST_ACTION,
        json: res
      })
    },
    error: option.error
  })
}
//清空订单列表
export function emptyOrderListAction(data, that) {
  return that.dispatch({
    type: EMPTY_ORDER_LIST_ACTION,
    json: data
  })
}
//订单明细
export function getOrderOetails(option) {
  fetch({
    url: `api/order/get`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//取消订单
export function orderCancel(option) {
  fetch({
    url: `api/order/cancel`,
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//确认收货
export function receiptGoods(option) {
  fetch({
    url: "api/order/receipt",
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}



//删除订单
export function deleteOrder(option){
  fetch({
    url: "api/order/delete",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//判断店铺支付方式
export function getShopPay(option){
  return get(Object.assign({
    url: `shop/getShopPay`,
  }, option), (json) => {
    return {
      type: GET_SHOP_PAY,
      json
    }
  })
  
}
//清空支付类型
export function emptyShopPay(json){
  return {
    type: EMPTY_SHOP_PAY,
    json
  }
}

//微信支付
export function wxPay(option){
  fetch({
    url: "api/wxpay/unifiedorder",
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//提交订单的商品
export function addSubmitShop(data) {
  return {
    type: ADD_SUBMIT_SHOP,
    json: data
  }
}
//更改收货地址
export function changeAddress(data) {
  return {
    type: CHANGE_ADDRESS,
    json: data
  }
}
//下单选择收货地址
export function orderAdressList(option) {
  return get(Object.assign({
    url: `api/address/available`,
  }, option), (json) => {
    return {
      type: ORDER_ADRESS_LIST,
      json
    }
  })
}
//获取送货时间
export function getDeliveryTime(option) {
  return get(Object.assign({
    url: `shop/listDeliveryTime`,
  }, option), (json) => {
    return {
      type: GET_DELIVERY_TIME,
      json
    }
  })
}
//选择支付方式
export function changePayType(data) {
  return {
    type: CHANGE_PAY_TYPE,
    json: data
  }
}
//选择配送方式
export function changeShopPay(data) {
  return {
    type: CHANGE_SHOP_PAY,
    json: data
  }
}

//更新配送时间
export function updataDeliveryTime(data) {
  return {
    type: UPDATA_DELIVERY_TIME,
    json: data
  }
}

//获取优惠方式
export function getPromotionMoney(option) {
  return post(Object.assign({
    url: `promotion/getPromotionMoney`,
    header: {
      'content-type': 'application/json'
    }
  }, option), (json) => {
    return {
      type: GET_PROMOTION_MONEY,
      json
    }
  })
}