
import {
  GET_SHOP_INFO_BY_ID_ACTION, 
  GET_SHOP_COMMENT_NUMBER,
  GET_TATOAL_SHOP_COMMENT,
  GET_HAS_IMAGE_SHOP_COMMENT,
  GET_GOODS_COMMENT_NUMBER,
  GET_BAD_COMMENT_NUMBER,
  GET_SHOP_REPORT_TYPE,
  EMPTY_COMMENT} from '../actions/shop'
const inintalgoods = {
  theme:"#FF004C"
}
/**
 * 功能：有sku 商品的操作
 * 描述：只是操作localStore 的数据 
 */
export function shopInfo(state = inintalgoods, action) {
  let json = action.json;
  switch (action.type) {
    case GET_SHOP_INFO_BY_ID_ACTION:
    
      let { result } = json;
      if (result.distance > 1000) {
        result.distance = (result.distance / 1000).toFixed(2) + "公里"
      } else {
        result.distance = result.distance + "米"
      }
      result.duration = Math.ceil((result.duration / 60))
      result.averageScore = 4.8 //Math.random(1) * 5;
      result.theme = result.theme || "#FF004C";
      return result;
    default:
      return state;
  }
}
const inintShopComment = {
  badEvaluate: {
    num: 0,
    data: [],
    code: -1
  },
  goodEvaluate: {
    num: 0,
    data: [],
    code: -1
  },
  hasImage: {
    num: 0,
    data: [],
    code: -1
  },
  totalEvaluate: {
    num: 0,
    data: [],
    code: -1
  },
  code: -1,
  load: true,
  totalScore: 4
}
export function shopComment(state = inintShopComment, action) {
  let json = action.json;
  let temData = state;
  switch (action.type) {
    case GET_SHOP_COMMENT_NUMBER:
      const { badEvaluateNum, goodEvaluateNum, hasImageNum, totalEvaluateNum, totalScore } = json.result;
      temData['badEvaluate'].num = badEvaluateNum;
      temData['goodEvaluate'].num = goodEvaluateNum;
      temData['hasImage'].num = hasImageNum;
      temData['totalEvaluate'].num = totalEvaluateNum;
      temData.totalScore =  Math.floor(totalScore * 100) / 100  ;
      temData.code = 0;
      return temData
    case GET_TATOAL_SHOP_COMMENT:
      let totalEvaluateData = temData['totalEvaluate'].data;
      temData['totalEvaluate'].data = [].concat(totalEvaluateData, json.result.data)
      temData['totalEvaluate'].code = 0;
      temData.code = 0;
      if (temData['totalEvaluate'].data.length < json.result.totalCount) {
        temData.load = true
      } else {
        temData.load = false
      }
      return temData
    case GET_HAS_IMAGE_SHOP_COMMENT:
      let hasImage = temData['hasImage'].data;
      temData['hasImage'].data = [].concat(hasImage, json.result.data)
      temData['hasImage'].code = 0;
      temData.code = 0;
      if (temData['hasImage'].data.length < json.result.totalCount) {
        temData.load = true
      } else {
        temData.load = false
      }
      return temData
    case GET_GOODS_COMMENT_NUMBER:
      let goodEvaluate = temData['goodEvaluate'].data;
      temData['goodEvaluate'].data = [].concat(goodEvaluate, json.result.data)
      temData['goodEvaluate'].code = 0;
      temData.code = 0;
      if (temData['goodEvaluate'].data.length < json.result.totalCount) {
        temData.load = true
      } else {
        temData.load = false
      }
      return temData
    case GET_BAD_COMMENT_NUMBER:
      let badEvaluate = temData['badEvaluate'].data;
      temData['badEvaluate'].data = [].concat(badEvaluate, json.result.data)
      temData['badEvaluate'].code = 0;
      temData.code = 0;
      if (temData['badEvaluate'].data.length < json.result.totalCount) {
        temData.load = true
      } else {
        temData.load = false
      }
      return temData
    case EMPTY_COMMENT:
      return inintShopComment;
    default:
      return state
  }
}
export function shopReportType(state = [], action) {
  let json = action.json;
  switch (action.type) {
    case GET_SHOP_REPORT_TYPE:
      return json.result
    default:
      return state
  }
}

