
import { GET_CATEGORY_LIST_ACTION, CLICK_CLASSIFICATION_ACTION, CLICK_CLASSIFICATION_TOW_ACTION, GET_CATEGORY_GOODS_ACTION, GET_CATEGORY_GOODS_DOWN_ACTION, CLICK_CLASSIFICATION_UPDATA_DOODS_ACTION, EMPTY_CATEGORY_LIST_ACTION, EMPTY_CATEGORY_GOODS_ACTION} from '../actions/classification'

export function classificationGoods(state={},action){
  let json = action.json;
  switch (action.type) {
    case GET_CATEGORY_GOODS_ACTION:
      Object.keys(state).map(item=>{
        state[item].select=false
      })
      state[json.id] = json.result;
      state[json.id].select = true;
      return state
    case GET_CATEGORY_GOODS_DOWN_ACTION:
        Object.keys(state).map(item => {
          state[item].select = false
        })
        let tem = [].concat(state[json.id].data,json.result.data)
        state[json.id].data = tem;
        state[json.id].totalCount = json.result.totalCount;
        state[json.id].totalPage = json.result.totalPage;
        state[json.id].select = true;
        return state;
    case CLICK_CLASSIFICATION_UPDATA_DOODS_ACTION:
      Object.keys(state).map(item => {
        state[item].select = false
      })
      state[json.id].select = true;
      return state;
    case EMPTY_CATEGORY_GOODS_ACTION:
     return Object.assign({})
    default:
      return state
  }
}
/**
 * 功能：分类列表
 * 描述：
 */
const inintalgoods = []
export function classification(state = inintalgoods, action) {
  let json = action.json;
  switch (action.type) {
    case GET_CATEGORY_LIST_ACTION:
      let cart = wx.getStorageSync('cart');
      json.result.map((item,index)=>{
        // let d = cart.filter(ix => ix.categoryId1 === item.id)
        // if(d.length>0){
        //   let number1 = 0
        //   d.map(i=>{
        //     number1 += i.number
        //   })
        //   item.number = number1
        // }else{
        //   item.number = 0;
        // }
        if (index == 0){
          item.select =true
          item.current = true
        }else{
          item.select =false
          item.current = false
        }
        let da = item.childs || [];
        da.map((ite,indexs)=>{
          if (indexs == 0) {
            ite.select = true
          } else {
            ite.select = false
          }
          // if (cart.filter(ix => ix.categoryId2 === ite.id).length>0){
          //   ite.check = true
          // }else{
          //   ite.check= false
          // }
        })
      })
      return [].concat(json.result);
    case CLICK_CLASSIFICATION_ACTION:
      state.map(item=>{
        if(item.id === json.id){
          if (item.childs && item.childs.length==0){
            item.select = true
          }else{
            item.select = !item.select
          }
          item.current = true
        }else{
          item.select = false
          item.current = false
        }
      })
      return state;
    case CLICK_CLASSIFICATION_TOW_ACTION:
      state.map(item => {
        if (item.childs && item.childs.length>0){
          item.childs.map(ix=>{
            if(ix.id == json.id){
              ix.select = true
            }else{
              ix.select = false
            }
          })
        }
      })
      return state;
    case EMPTY_CATEGORY_LIST_ACTION:
      return [];
    default:
      return state
  }
}

