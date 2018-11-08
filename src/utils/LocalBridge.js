import Bridge from 'seedsui-react/lib/Bridge';

var LocalBridge = {
  _logOut: function () {
    // 如果是订货或者外勤365,直接返回到登录页面
    if (Bridge.platform === 'dinghuo' || Bridge.platform === 'waiqin') {
      Bridge.logOut();
      return;
    }
    window.location.replace('/#/login/')
  },
  logOut: function (message) { // 退出到登陆页面
    if (message) {
      Bridge.showToast(message, {
        onSuccess: () => {
          this._logOut()
        }
      })
    } else {
      this._logOut()
    }
  }
}

export default LocalBridge
