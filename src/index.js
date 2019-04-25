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
// 加载订货库
import LocalBridge from 'utils/LocalBridge';
// 加载路由
import Routes from './routes.js';

// 换click事件为tap
if (Device.platform === 'dinghuo' || Device.platform === 'waiqin') {
  FastClick.attach(document.getElementById('root'));
  var root = document.getElementById('root');
  // ios快速点击的问题
  if (root && Device.os === 'ios') {
    FastClick.attach(root);
  }
  // 适配差安卓, 解决在app中, 输入法上弹界面错位的问题
  if (root && Device.os === 'andriod' && Device.osVersion < '5.0') {
    root.style.position = 'fixed' // 处理客户端中, 输入法上弹收缩后, 界面显示错位的问题
  }
}

// 修复兼容ios的bug
if (Device.os === 'ios' && Device.platform !== 'dinghuo') {
  document.getElementById('root').addEventListener('click', (e) => {
    console.log(e);
    let type = e.target.getAttribute('type');
    if (e.target.tagName === 'TEXTAREA') {
      type = 'textarea';
    }
    if (type) {
      type = type.toLocaleLowerCase();
    } else {
      type = ''
    }
    if (type === 'tel' || type === 'number' || type === 'text' || type === 'password' || type === 'textarea' || type === 'search') {
      // 弹出输入法页面白屏, 获取焦点时auto, 失去焦点时touch(很有可能是在非body元素下有fixed定位的元素导致, 不建议用此方式去解决)
      // document.getElementById('root').style.WebkitOverflowScrolling = 'auto | touch';
      // 修复兼容ios12的bug
      if (Device.os === 'ios' && Device.osVersion > '12') {
        // 兼容输入法把页面顶上去, 不回弹的问题
        if (window.inputToggleTimeout) {
          window.clearTimeout(window.inputToggleTimeout);
        }
        if (!e.target.getAttribute('ios-bug-blur')) {
          e.target.setAttribute('ios-bug-blur', '1');
          e.target.addEventListener('blur', () => {
            window.inputToggleTimeout = window.setTimeout(() => {
              document.getElementById('root').scrollIntoView();
            }, 100);
          }, false);
        }
      }
    }
  }, false);
}

// axios设置
const env = process.env.NODE_ENV;
if (env === 'development') {
  // ApiAxios.setBaseURL(`http://172.31.3.96:3000/api`);
  ApiAxios.setBaseURL(`http://localhost:3000/api`);
}

// 处理401
ApiAxios.setLogOut((response) => {
  LocalBridge.logOut(response.data.message);
})

// 动态加载桥接库
Device.dynamicLoadBridge(() => {
  ReactDOM.render(<Routes />, document.getElementById('root'));
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
