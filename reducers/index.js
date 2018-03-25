const Redux = require('../libs/redux.js')
const combineReducers = Redux.combineReducers
import { hotGoods,homeifcation, searchGoods, specialGoods, homedetail} from './home'
import { shopcart} from './shopcart'
import { shopInfo, shopComment, shopReportType} from './shop'
import { shopDetails} from './goods'
import { classification, classificationGoods} from './classification'
import { orderList, orderSubmitData} from './order'
import { platformList, platfromCarousel, shopsList} from './platformHome.js'
const todoApp = combineReducers({
  hotGoods,
  homedetail,
  specialGoods,
  shopReportType,
  searchGoods,
  shopComment,
  homeifcation,
  shopInfo,
  shopcart,
  shopDetails,
  classification,
  classificationGoods,
  orderList,
  orderSubmitData,
  platformList,
  platfromCarousel,
  shopsList
})

module.exports = todoApp