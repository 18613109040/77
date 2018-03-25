
import { ADD_SHOP_CQART, ADD_SKU_SHOP_CQART, DECREASE_SHOP_CART_ACTION, DECREASE_SKU_SHOP_CART_ACTION, DELETE_SKU_SHOP_CART_ACTION, DELETE_SHOP_CART_ACTION, CLRAE_SHOP_CART_ACTION, UPDATA_CART_ACTION} from '../actions/shopcart'

/**
 * 功能：有sku 商品的操作
 * 描述：只是操作localStore 的数据 
 */
export function shopcart(state =[], action) {
  let json = action.json;
  let value = wx.getStorageSync('cart') || [];
  switch (action.type) {
    case ADD_SHOP_CQART:
      if (value.length > 0) {
        let fliterData = value.filter(item => item.multiKinds == 0 && json.id == item.id)
        if (fliterData.length > 0) {
          value.map(item => {
            if (item.multiKinds == 0 && json.id == item.id) {
              item.number = item.number + 1
            }
          })
         
        } else {
          value.push(Object.assign({}, json, { number: 1 }))
         
        }
      } else {
        value.push(Object.assign({}, json, { number: 1 }))
      }
      value.map(item=>{
        if (item.discountFlag && (item.limitNum >= item.number) ){
          item.totalMoney = parseFloat(item.discountPrice * item.number).toFixed(2)
        } else if (item.discountFlag && (item.limitNum < item.number)){
          item.totalMoney = parseFloat(item.discountPrice * item.limitNum + (item.number - item.limitNum) * item.price).toFixed(2)
        }else{
          item.totalMoney = parseFloat(item.price * item.number).toFixed(2)
        }
      })
      wx.setStorageSync('cart', value)
      return [].concat(value);
    case DECREASE_SHOP_CART_ACTION:
      value.map(item => {
        if (item.multiKinds == 0 && json.id == item.id) {
          item.number = item.number - 1
        }
      })
      
      value.map(item => {
        if (item.discountFlag && (item.limitNum >= item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.number).toFixed(2)
        } else if (item.discountFlag && (item.limitNum < item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.limitNum + (item.number - item.limitNum) * item.price).toFixed(2)
        } else {
          item.totalMoney = parseFloat(item.price * item.number).toFixed(2)
        }
      })
      wx.setStorageSync('cart', value.filter(item => item.number > 0))
      return [].concat(value.filter(item => item.number > 0))
    case ADD_SKU_SHOP_CQART:
      if (value.length>0) {
        let fliterData = value.filter(item => item.multiKinds == 1 && json.id == item.id && item.skuid == json.skuid)
        if (fliterData.length > 0) {
          value.map(item => {
            if (item.multiKinds == 1 && json.id == item.id && item.skuid == json.skuid) {
              item.number = item.number + 1
            }
          })
         
        } else {
          value.push(Object.assign({},json,{number:1}))
         
        }
      } else {
        value.push(Object.assign({}, json, { number: 1 }))
       
      }
      value.map(item => {
        if (item.discountFlag && (item.limitNum >= item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.number).toFixed(2)
        } else if (item.discountFlag && (item.limitNum < item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.limitNum + (item.number - item.limitNum) * item.price).toFixed(2)
        } else {
          item.totalMoney = parseFloat(item.price * item.number).toFixed(2)
        }
      })
      wx.setStorageSync('cart', value)
      return [].concat(value);
    case DECREASE_SKU_SHOP_CART_ACTION:
      let cartData = wx.getStorageSync('cart') || [];
      cartData.map(item => {
        if (item.multiKinds == 1 && json.id == item.id && item.skuid == json.skuid) {
          item.number = item.number - 1
        }
      })
      cartData.map(item => {
        if (item.discountFlag && (item.limitNum >= item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.number).toFixed(2)
        } else if (item.discountFlag && (item.limitNum < item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.limitNum + (item.number - item.limitNum) * item.price).toFixed(2)
        } else {
          item.totalMoney = parseFloat(item.price * item.number).toFixed(2)
        }
      })
      wx.setStorageSync('cart', cartData.filter(item => item.number > 0))
      return [].concat(cartData.filter(item => item.number > 0))
    case UPDATA_CART_ACTION:
      let cartData3 = wx.getStorageSync('cart') || [];
      if (json.skuid) {
        if (cartData3.filter(item => item.id === json.id && item.skuid === json.skuid).length > 0) {
          cartData3.map(item => {
            if (item.id === json.id && item.skuid === json.skuid) {
              item.number = json.number
            }
          })
        } else {
          cartData3.push(json)
        }
      } else {
        if (cartData3.filter(item => item.id === json.id).length > 0) {
          cartData3.map(item => {
            if (item.id === json.id) {
              item.number = json.number
            }
          })
        } else {
          cartData3.push(json)
        }
      }
      cartData3.map(item => {
        if (item.discountFlag && (item.limitNum >= item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.number).toFixed(2)
        } else if (item.discountFlag && (item.limitNum < item.number)) {
          item.totalMoney = parseFloat(item.discountPrice * item.limitNum + (item.number - item.limitNum) * item.price).toFixed(2)
        } else {
          item.totalMoney = parseFloat(item.price * item.number).toFixed(2)
        }
      })
      wx.setStorageSync('cart', cartData3.filter(item => item.number > 0))
      return [].concat(cartData3.filter(item => item.number > 0))
    case CLRAE_SHOP_CART_ACTION:
      wx.removeStorageSync('cart')
      return [];
    default:
      return state
  }
}

