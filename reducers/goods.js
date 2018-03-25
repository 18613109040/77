
import {  SHOP_DETAILS_ACTION } from '../actions/goods'
const inintalgoods = {

}
/**
 * 功能：有sku 商品的操作
 * 描述：只是操作localStore 的数据 
 */
export function shopDetails(state = inintalgoods, action) {
  let json = action.json;
  switch (action.type) {
    case SHOP_DETAILS_ACTION:
      if (json.result.detail){
        json.result.detail = JSON.parse(json.result.detail)
      }else{
        json.result.detail=[]
      }
      return Object.assign({},json.result);
    default:
      return state
  }
}

