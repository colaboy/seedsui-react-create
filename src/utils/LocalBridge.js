import Bridge from 'seedsui-react/lib/Bridge';
import Device from 'seedsui-react/lib/Device';
import DB from 'seedsui-react/lib/DB';
import ApiAxios from 'seedsui-react/lib/ApiAxios';

var LocalBridge = {
 /*
  * 物理返回
  * @params _history route的history
  * @params number 后退层级
  * */
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
  /*
  * 注销
  * @params message 提示消息
  * */
  _logOut: function (message) {
    // 如果是订货或者外勤365,直接返回到登录页面
    if (Bridge.platform === 'dinghuo' || Bridge.platform === 'waiqin') {
      Bridge.logOut(message || '');
      return;
    }
    window.location.replace('/#/login/')
  },
  logOut: function (message) { // 退出到登陆页面
    if (message) {
      Bridge.showToast(message, {
        onSuccess: () => {
          this._logOut(message)
        }
      })
    } else {
      this._logOut(message)
    }
  },
  /*
  * 微信鉴权
  * @params opts {url: string, (可选)params: {appId: '', url: ''}, onSuccess: func, onError: func, onReady: func, onFail: func}
  * */
  config: function (opts = {}) {
    if (Device.platform.indexOf('weixin') === -1) return;
    var errMsg = ''
    var serviceUrl = opts.url || '/wxapi/getJsApiTicket.action'
    // 记录进入app的url，后面微信sdk
    var url = encodeURIComponent(window.location.href.split('#')[0]);
    var ticketParams = {
      appId: DB.getStore('dinghuo_appId') || '',
      url: url
    }
    ApiAxios.get(serviceUrl, {data: opts.params || ticketParams}).then(response => {
      let result = response
      if (result.code === '1') {
        if (opts.onSuccess) {
          opts.onSuccess({result: result, status: '1'})
        } else {
          this.wxSignature(opts, result)
        }
      } else {
        if (opts.onError) opts.onError({code: 'oauthInterfaceFail', msg: response.message})
        else Bridge.showToast(response.message, {mask: false})
      }
    })
    .catch(err => {
      errMsg = '微信鉴权接口异常,请稍后重试'
      if (opts.onError) opts.onError({code: 'oauthInterfaceFail', msg: errMsg})
      else Bridge.showToast(errMsg, {mask: false})
    })
  },
  wxSignature: function (opts, result) {
    var errMsg = ''
    const params = {
      debug: opts.debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: result.data.appId, // 必填，公众号的唯一标识
      timestamp: result.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
      signature: result.data.signature,// 必填，签名，见附录1
      jsApiList: ['getLocation', 'chooseImage', 'uploadImage', 'previewImage', 'onHistoryBack', 'closeWindow', 'hideOptionMenu', 'hideMenuItems', 'scanQRCode']
    }
    if (!wx) { // eslint-disable-line
      errMsg = '微信组件下载失败,如需使用本地能力,请返回重试'
      if (opts.onFail) opts.onFail({code: 'bridgeInitFail', msg: errMsg})
      else Bridge.showToast(errMsg, {mask: false})
      return
    }
    wx.config(params) // eslint-disable-line
    wx.ready(function () { // eslint-disable-line
      // 隐藏右上角按钮
      // wx.hideOptionMenu() // eslint-disable-line
      // 桥接成功
      DB.setSession('bridge_isready', '1')
      // Callback
      if (opts.onReady) opts.onReady()
    })
    wx.error(function (res) { // eslint-disable-line
      // 桥接失败
      DB.setSession('bridge_isready', '-1')
      // Callback
      errMsg = '微信签名过期导致验证失败' + JSON.stringify(res)
      if (opts.onFail) opts.onFail({code: 'oauthFail', msg: errMsg})
      else Bridge.showToast(errMsg, {mask: false})
    })
  },
  /*
  * 获取上传目录: 模块名/年月日
  * @params module 模块名
  * @params dateType 生成的日期类型
  * */
  getDir: function (module, dateType = 'date') { // report | appeal | returnbottles | reportexe
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (dateType === 'year') {
      return module + '/' + year;
    } else if (dateType === 'month') {
      return module + '/' + year + (month < 10 ? '0' + month : month);
    } else if (dateType === 'date') {
      return module + '/' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day);
    }
  },
  /*
  * 兼容ios12输入法把页面顶上去, 不回弹的问题
  * */
  iosInputBounceBack: function () {
    console.log('blur');
    document.getElementById('root').scrollIntoView();
  },
  iosInputBounceBackByElement: function (e) {
    e.target.scrollIntoView();
  }
}

export default LocalBridge
