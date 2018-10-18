import Bridge from 'seedsui-react/lib/Bridge';
import Device from 'seedsui-react/lib/Device';
import DB from 'seedsui-react/lib/DB';
import ApiAxios from 'seedsui-react/lib/ApiAxios';

var Dinghuo = {
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
    // 否则跳转到登录页面
    var login_url = '/h5fw/#/_react_/login'
    // openId & appId
    login_url += `/${DB.getStore('app_openId') || 'false'}/${DB.getStore('app_appId') || 'false'}`
    // message
    login_url += '?msg=' + (message || '')
    // 红包页面跳回
    if (window.location.href.indexOf('/redpacket') >= 0) {
      login_url += '&page=redpacket'
    }
    window.location.replace(login_url)
  },
  /*
   * 设置系统参数
   * @param data: {appId: '', openId: '', image_url: '', mobile: '', selectedSupplier: object, sysParms: object}
   * */
  setSystemParameter: function (data) {
    // 设置系统参数
    if (data.sysParms) DB.setStore('app_sysparams', data.sysParms)
    // 设置图片主域名
    let imgDomain = data.image_url ? data.image_url.clearProtocol() : '';
    if (imgDomain && imgDomain.length - 1 !== imgDomain.lastIndexOf('/')) {
      imgDomain = imgDomain + '/';
      DB.setStore('app_imgDomain', decodeURIComponent(imgDomain));
    } else {
      console.log('图片域名未定义');
      return {code: 'imgDomainFail', msg: '图片域名未定义'};
    }
    // 设置uid
    DB.setStore('app_uid', data.uid || '');
    // 设置手机号
    DB.setStore('app_mobile', data.mobile || '');
    // 设置appId和openId
    if (data.openId) DB.setStore('app_openId', data.openId || '');
    if (data.appId) DB.setStore('app_appId', data.appId || '');
    // 设置选中的供货商
    if (data.selectedSupplier && typeof data.selectedSupplier === 'object') {
      DB.setStore('app_selectedSupplier', data.selectedSupplier);
    } else {
      console.log('没有供货商');
      return {code: 'selectedSupplierFail', msg: '请选择供货商'};
    }
  },
  /*
   * 获取系统参数
   * 参数: params{appId: '', code: ''}
   * 返回：{resultStr:''}
   * */
  getSystemParameter: function (params = {}) {
    var sysparams = DB.getStore('app_sysparams') || []
    for (var i = 0, sysparam; sysparam = sysparams[i++];) { // eslint-disable-line
      if (sysparam.appId === params.appId && sysparam.code === params.code) {
        return sysparam.value
      }
    }
    return ''
  },
  loadSystemParameter: function (callback) {
    // 判断localstorge是否有值
    if (DB.getStore('app_uid')) {
      callback();
      return;
    }
    ApiAxios.get(`/login/getSystemParameter.action`).then(result => {
      if (result.code === '1') {
        this.setSystemParameter(result.data);
        // 加载数据
        callback();
      } else {
        // 提示获取地址失败
        this.showToast(result.message)
      }
    }).catch(() => {
      this.logOut('请求系统参数异常，请重新登录')
      // this.showMsg('请求系统参数异常，请稍后重试');
    });
  }
}

export default Dinghuo
