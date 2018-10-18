import { createStore, applyMiddleware } from 'redux'
// Reducer
import reducer from './modules/reducer.js'
// Middleware: thunk
import thunk from 'redux-thunk';
// Middleware: client
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import clientMiddleware from './middleware/clientMiddleware';
// Store
const store = createStore(reducer, applyMiddleware(thunk, clientMiddleware(ApiAxios)));

export default store