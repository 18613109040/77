
import { GET_ORDER_LIST_ACTION, EMPTY_ORDER_LIST_ACTION, GET_SHOP_PAY, CHANGE_SHOP_PAY, CHANGE_PAY_TYPE, GET_DELIVERY_TIME, UPDATA_DELIVERY_TIME, ORDER_ADRESS_LIST, CHANGE_ADDRESS, ADD_SUBMIT_SHOP, GET_PROMOTION_MONEY, EMPTY_SHOP_PAY} from '../actions/order'
const inintalgoods = {
  data:[],
  totalCount:0,
  totalPage:0
}
/**
 * 功能：订单列表数据
 * 描述：
 */
export function orderList(state = inintalgoods, action) {
  let json = action.json;
  switch (action.type) {
    case GET_ORDER_LIST_ACTION:
      json.result = {
        data: [].concat(state.data, json.result.data),
        totalCount: json.result.totalCount,
        totalPage: json.result.totalPage
      }
      return Object.assign({}, json.result);
    case EMPTY_ORDER_LIST_ACTION:
      return {
        data: [],
        totalCount: 0,
        totalPage: 0
      }
    default:
      return state
  }
}

const inintorder = {
  shopPay: {
    aliPay: false,
    isExpressOpen: false,
    isOffLinePayOpen: true,
    isSelfTakeOpen: true,
    isSendOpen: true,
    isWxPayOpen: true,
    wechatPay: true,
    selected: 0,//默认送货方式
    selsetpay: 0, //默认支付方式 0线下 1 微信 目前只支持以上两种支付方式
    sucess: false
  },
  deliveryTime: {
    deliveryFee: 1,
    timeSolts: []
  },
  promotionMoney: {
    fullCut: {
      cutMoney: 0
    },
    discount: {
      discountMoney: 0,
      preferential: 0,
      totalMoney: 0
    },
    promotionType: 0
  },
  available: {},
  cart: []
}

//提交订单页所有数据组合
export function orderSubmitData(state = inintorder, action) {
  let json = action.json;
  switch (action.type) {
    case GET_SHOP_PAY:
      //获取送货方式
      if (json.result.isSelfTakeOpen) {
        Object.assign(json.result, { selected: 0 })
      } else if (!json.result.isSelfTakeOpen && json.result.isSendOpen) {
        Object.assign(json.result, { selected: 1 })
      } else if (!json.result.isSelfTakeOpen && !json.result.isSendOpen && json.result.isExpressOpen) {
        Object.assign(json.result, { selected: 2 })
      }

      //获取支付方式
      if (json.result.isWxPayOpen) {
        Object.assign(json.result, { selsetpay: 1 })
      } else {
        Object.assign(json.result, { selsetpay: 0 })
      }
      Object.assign(json.result, { sucess: true })
      return Object.assign({}, state, { shopPay: json.result });
    case CHANGE_SHOP_PAY:
      state.shopPay.selected = json;
      return state;
    case CHANGE_PAY_TYPE:
      state.shopPay.selsetpay = json;
      return state;
    case GET_DELIVERY_TIME:
      //配送时间
      json.result.timeSolts.map((item, index) => {
        if (index == 0) {
          item.check = true;
        } else {
          item.check = false;
        }
      })
      return Object.assign({}, state, { deliveryTime: json.result })
    case UPDATA_DELIVERY_TIME:
      state.deliveryTime.timeSolts.map(item => {
        if (item.timeSolt.toString() == json.toString()) {
          item.check = true
        } else {
          item.check = false
        }
      })
      return state;
    case ORDER_ADRESS_LIST:
      if ((json.result || []).length > 0) {
        return Object.assign({}, state, { available: json.result.find(item => item.available == true) })
      } else {
        return Object.assign({}, state, { available: {} })
      }
    //收货地址

    case CHANGE_ADDRESS:
      return Object.assign({}, state, { available: json })
    case ADD_SUBMIT_SHOP:
      //获取购物商品
      return Object.assign({}, state, { cart: json })
    case GET_PROMOTION_MONEY:
      //获取优惠方式
      return Object.assign({}, state, { promotionMoney: json.result })
    case EMPTY_SHOP_PAY:

      return inintorder;
    default:
      return state;
  }

}
