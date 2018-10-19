import { createStore, applyMiddleware } from 'redux';
// Reducer
import reducer from './modules/reducer.js';
// Middleware: thunk
import thunk from 'redux-thunk';
// Middleware: client
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import requestMiddleware from 'seedsui-react/lib/ReduxRequestMiddleware';
// Store
const store = createStore(reducer, applyMiddleware(thunk, requestMiddleware(ApiAxios)));

export default store