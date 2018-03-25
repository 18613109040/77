import { GET_HOTGOODS_ACTION, ININT_HOTGOODS_ACTION, GET_CAROUSEL_LIST_ACTION, GET_SPECIALS_ACTION, GET_CLASSIFICATION_ACTION, GET_SEARCH_GOODS_ACTION, EMPTY_SEARCH_GOODS_ACTION, GET_SPECIALS_GOODS_ACTION, GET_SHOP_TOP_CATEGORY_ACTION} from '../actions/home'
/**
 * 拼接首页所有数据
 * @shopTopCategory {Array} 首页分类
 * @shopImages {Array} 轮播图
 * @specials {Array} 特价商品
 * @hotGoods {Array} 热门商品
 **/
const inintDetail={
  shopTopCategory:[],
  shopImages:[],
  specials:[],
  hotGoods:[]
}
export function homedetail(state=inintDetail,action){
  let json = action.json;
  switch (action.type) {
    case GET_SHOP_TOP_CATEGORY_ACTION:
      return Object.assign({},state,{
        shopTopCategory:json.result||[]
      })
    case GET_CAROUSEL_LIST_ACTION:
      return Object.assign({}, state, {
        shopImages: json.result||[]
      })
    case GET_SPECIALS_ACTION:
      return Object.assign({}, state, {
        specials: json.result||[]
      })
    case GET_HOTGOODS_ACTION:
      console.dir(json)
      return Object.assign({}, state, {
        hotGoods: json.result.data||[]
      })
    default:
      return state
  }
}

export function homeifcation(state = [], action) {
  let json = action.json;
  switch (action.type) {
    case GET_CLASSIFICATION_ACTION:
      return [].concat(json.result)
    default:
      return state
  }
}
//活动专场
export function specialGoods(state = {imgUrl:"",goods:[]}, action) {
  let json = action.json;
  switch (action.type) {
    case GET_SPECIALS_GOODS_ACTION:
      return json.result
    default:
      return state
  }
}


const inintalgoods = {
  errorCode: -1,
  errorMsg: "初始化数据",
  result: {
    data: []
  },
  success: false
}
export function hotGoods(state = inintalgoods, action) {
  let json = action.json;
  let cart = wx.getStorageSync('cart');
  switch (action.type) {
    case GET_HOTGOODS_ACTION:
      return Object.assign({}, state, json);
      return Object.assign({}, state);
    case ININT_HOTGOODS_ACTION:
      state.result.data.map(item => {
        if (cart && cart.length > 0) {
          if (cart.filter(dx => dx.id == item.id && dx.multiKinds == 0).length > 0) {
            item.number = cart.filter(dx => dx.id == item.id && dx.multiKinds == 0)[0].number;
          } else {
            item.number = 0;
          }
        } else {
          item.number = 0;
        }
      })
      return Object.assign({}, state);
    default:
      return state
  }
}

//获取搜索商品
export function searchGoods(state = { data: [], totalCount: 0, totalPage:0}, action) {
  let json = action.json;
  switch (action.type) {
    case GET_SEARCH_GOODS_ACTION:
      let totalCount = json.result.totalCount;
      let totalPage = json.result.totalPage;
      let tem =  [].concat(state.data,json.result.data)
      return Object.assign({},{
        totalCount: totalCount,
        totalPage: totalPage,
        data: tem
      })
    case EMPTY_SEARCH_GOODS_ACTION:
      return Object.assign({}, { data: [], totalCount: 0, totalPage: 0})
    default:
      return state
  }
}



