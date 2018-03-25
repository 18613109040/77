import { GET_PLAT_FROM_LIST_ACTION, GET_PLAT_FROM_CAROUSEL_ACTION, GET_SHOP_BY_LAT_AND_LONG_ACTION, EMPTY_SHOP_LIST_ACTION} from "../actions/platformHome.js"
//分类
export function platformList(state=[],action){
  let json  = action.json;
  switch(action.type){
    case GET_PLAT_FROM_LIST_ACTION:
      return json.result || [];
    default:
      return state;
  }
}
//轮播
export function platfromCarousel(state = [], action){
  let json = action.json;
  switch (action.type) {
    case GET_PLAT_FROM_CAROUSEL_ACTION:
      return json.result || [];
    default:
      return state;
  }
}
//商店列表
export function shopsList(state={data:[]},action){
  let json = action.json;
  switch (action.type) {
    case GET_SHOP_BY_LAT_AND_LONG_ACTION:
      let data = json.result.data || [];
      data.map(item => {
        if (item.distance > 1000) {
          item.distance = (item.distance / 1000).toFixed(2) + "公里"

        } else {
          item.distance = item.distance + "米"
        }
        item.duration = Math.ceil((item.duration / 60))
        item.averageScore =  4.8 //Math.random(1) * 5
      })
      let oldState = {...state};
      let renderData={
        data: oldState.data.concat(json.result.data),
        totalCount: json.result.totalCount,
        totalPage: json.result.totalPage
      }
      return renderData;
    case EMPTY_SHOP_LIST_ACTION:
      return {
        data:[]
      }
    default:
      return state;
  }
}

