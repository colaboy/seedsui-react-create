import Bridge from 'seedsui-react/lib/Bridge';
import Device from 'seedsui-react/lib/Device';

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
  },
  back: function (_history, number) {
    var self = Bridge
    var isFromApp = Device.getUrlParameter('isFromApp', location.search) || ''
    if (isFromApp === '1') {
      Bridge.closeWindow();
    } else if (isFromApp === 'home') {
      Bridge.goHome();
    } else if (isFromApp === 'confirm') {
      Bridge.showConfirm('您确定要离开此页面吗?', {
        onSuccess: (e) => {
          e.hide();
          if (_history) _history.go(number || -1);
          else window.history.go(number || -1);
        }
      });
    } else if (isFromApp === 'confirm-close') {
      Bridge.showConfirm('您确定要离开此页面吗?', {
        onSuccess: (e) => {
          e.hide();
          self.closeWindow();
        }
      });
    } else {
      if (_history) _history.go(number || -1);
      else window.history.go(number || -1);
    }
  },
  getDir: function (module, dateType = 'date') { // report | appeal | returnbottles | reportexe
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    if (dateType === 'year') {
      return module + '/' + year;
    } else if (dateType === 'month') {
      return module + '/' + year + (month < 10 ? '0' + month : month);
    } else if (dateType === 'date') {
      return module + '/' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day);
    }
  }
}

export default LocalBridge
