import Bridge from 'seedsui-react/lib/Bridge';
import Device from 'seedsui-react/lib/Device';

var LocalBridge = {
  // 退出到登陆页面
  logOut: function (message) {
    // 如果是订货或者外勤365,直接返回到登录页面
    if (Bridge.platform === 'dinghuo' || Bridge.platform === 'waiqin') {
      Bridge.logOut();
      return;
    }
    // 如果有errMsg,则停止
    var errMsg = Device.getUrlParameter('errMsg')
    // 如果地址栏有errMsg,则优先显示地址栏
    if (errMsg) {
      try {
        errMsg = decodeURIComponent(errMsg)
      } catch (e) {
        errMsg = '未知错误'
      }
      window.location.replace('/h5fw/#/_react_/exception/' + errMsg)
      return
    }
  }
}

export default LocalBridge
