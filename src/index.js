import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import 'core-js/es6/map'; // 兼容es6的Map类
import 'core-js/es6/set'; // 兼容es6的Set类
// import 'raf/polyfill'; // 兼容requestAnimationFrame动画
// 加载seedsui库
import 'components/seedsui/index.less';
import 'seedsui-react/lib/PrototypeArray.js';
import 'seedsui-react/lib/PrototypeMath.js';
import 'seedsui-react/lib/PrototypeObject.js';
import 'seedsui-react/lib/PrototypeString.js';
import 'seedsui-react/lib/PrototypeDate.js';
import Device from 'seedsui-react/lib/Device';
import FastClick from 'seedsui-react/lib/FastClick';
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import Bridge from 'seedsui-react/lib/Bridge';
// 加载本地桥接库
// import LocalBridge from 'utils/LocalBridge';
// 加载路由
import Routes from './routes.js';

// 换click事件为tap
if (Device.platform === 'dinghuo' || Device.platform === 'waiqin') {
  FastClick.attach(document.getElementById('root'));
}

// 适配刘海屏和andriod5.0以下的手机
Device.adapterMobile();

// 处理客户端中安卓5.0以下手机输入法上弹隐藏后,界面显示错位的问题
if ((Device.platform === 'dinghuo' || Device.platform === 'waiqin') && Device.os === 'andriod' && Device.osVersion < '5.0') {
  document.getElementById('root').style.position = 'fixed';
}

// axios设置
const env = process.env.NODE_ENV;
if (env === 'development') {
  ApiAxios.setBaseURL(`http://172.31.3.96:8080/api`);
  ApiAxios.setBaseURL(`http://localhost:3000/api`);
}

// 处理401
ApiAxios.setLogOut((response) => {
  // LocalBridge.logOut(response.data.message);
})

// 动态加载桥接库
Device.dynamicLoadBridge(() => {
  ReactDOM.render(<Routes />, document.getElementById('root'));
  /* eslint-disable */
  if (Device.platform === 'waiqin' && Bridge.getAppVersion() >= '6.2.6' && Device.platform === 'ios') wq.wqload.wqBackGesture(JSON.stringify({enable: '0'}));
  /* eslint-enable */
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
