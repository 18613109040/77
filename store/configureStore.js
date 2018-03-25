const { createStore, compose, applyMiddleware } = require('../libs/redux.js');
const reducer = require('../reducers/index.js')
import thunk from '../libs/redux-thunk.js'
function configureStore(initialState) {
  //return createStore(reducer, initialState);
   // actions 内异步返回
  return compose(applyMiddleware(thunk))(createStore)(reducer, initialState);
}

module.exports = configureStore;
