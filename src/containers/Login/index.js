import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {login, sentSms} from 'store/modules/login';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import InputPhone from 'seedsui-react/lib/InputPhone';
import Button from 'seedsui-react/lib/Button';
import DB from 'seedsui-react/lib/DB';
import Device from 'seedsui-react/lib/Device';
import Loading from 'seedsui-react/lib/Loading';
import Verify from 'seedsui-react/lib/Verify';
import Bridge from 'seedsui-react/lib/Bridge';

var InputStyle = {
  backgroundColor: 'white',
  margin: '12px 45px',
  padding: '0 12px',
  borderRadius: '3px',
  border: '1px solid #BDBDBD',
  height: '45px'
}
var submitStyle = {
  margin: '30px 45px',
  borderRadius: '5px',
  height: '45px'
}
var logoStyle = {
  margin: '70px auto 40px auto',
  width: '70px',
  display: 'block'
}

export default
@withRouter
@connect(state => ({
  isLoading: state.login.isLoading
}), {
  login,
  sentSms
})
class Login extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    login: PropTypes.func,
    sentSms: PropTypes.func
  };
  constructor (props) {
    super(props);
    this.state = {
      appId: '',
      openId: '',
      username: '',
      sentCode: '',
      disabled: true,
      sentStatus: '', // 发送验证码状态
      sentDisabled: true
    }
  }
  componentDidMount = () => {
    // 设置appId和openId
    const {openId, appId} = this.props.match.params;
    // 先从url上取,再从localstorge里取
    if (openId && openId !== 'false') {
      this.setState({
        openId: openId
      })
    }
    if (appId && appId !== 'false') {
      this.setState({
        appId: appId
      })
    }
    if (DB.getStore('app_appId')) {
      this.setState({
        appId: DB.getStore('app_appId')
      })
    }
    if (DB.getStore('app_openId')) {
      this.setState({
        openId: DB.getStore('app_openId')
      })
    }
    // 提示消息
    const msg = Device.getUrlParameter('msg', this.props.location.search);
    if (msg) {
      Bridge.showToast(decodeURIComponent('' + msg), {mask: false});
    }
  }
  onUIDChange = (value) => {
    this.setState({
      username: value
    }, () => {
      this.validateVerify();
      this.validateSubmit();
    });
  }
  onValiChange = (error, value, {result, status, op}) => {
    this.setState({
      sentStatus: status
    }, () => {
      // 点击或者倒计时结束时,校验是否禁用发送按钮
      if (op === 'click' || op === 'timeover') {
        this.validateVerify();
      }
    })
    if (op === 'input') {
      this.setState({
        sentCode: value
      }, () => {
        this.validateSubmit();
      });
    }
  }
  onLine = () => {
    if (!Device.isOnLine) {
      Bridge.showToast('网络状态不佳', {mask: false});
      return false;
    }
    return true;
  }
  validateVerify = () => {
    const {username, sentStatus} = this.state;
    // 验证码初始状态或者发送失败时才可以点击发送验证码
    if (username.length === 11 && (sentStatus === '' || sentStatus === 'send_fail' || sentStatus === 'sent_fail')) {
      this.setState({
        sentDisabled: false
      });
    } else {
      this.setState({
        sentDisabled: true
      });
    }
  }
  validateSubmit = () => {
    const {username, sentCode} = this.state;
    if (username.length === 11 && sentCode.length === 6) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  }
  onValiBefore = () => {
    if (!this.onLine()) return '网络状态不佳';
    const {appId} = this.state;
    if (!appId) {
      return 'appId不存在,请联系管理员';
    }
  }
  onError = (err) => {
    Bridge.showToast(err.msg, {mask: false});
  }
  onSubmit = () => {
    if (!this.onLine()) return;
    const {openId, appId} = this.state;
    const params = {
      mobile: this.state.username,
      verifyCode: this.state.sentCode,
      clientType: 'client-android-000000',
      clientVersion: '2.0.4'
    }
    if (openId) params.openId = openId;
    if (appId) {
      params.clientType = appId;
      params.appId = appId;
    }
    const page = Device.getUrlParameter('page', this.props.location.search);
    this.props.login(params).then((result) => {
      if (result.code === '1') {
        const {history} = this.props;
        // 红包页面
        if (page === 'redpacket') {
          history.replace('/_react_/redpacket');
          return;
        }
        // 我的页面
        if (page === 'me') {
          history.replace('/_react_/main/me/firstPage');
          return;
        }
        // 如果没有选择供货商,则先选择供货商
        if (!Boolean(result.data.hasDefaultSupplier)) {
          history.replace(`/_react_/supplier/${result.data.uid}/false`);
          return;
        }
        // 进入首页
        history.replace(`/_react_/main/home`);
      } else {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('请求错误，请稍后再试', {mask: false});
    });
  }
  render() {
    const {username, appId, disabled, sentDisabled} = this.state;
    const {isLoading} = this.props;
    return (
      <Page style={{overflow: 'auto', backgroundColor: 'white'}}>
        <img src="//res.waiqin365.com/d/dinghuo365/logo.png" alt="" style={logoStyle}/>
        <InputPhone onError={this.onError} clear onChange={this.onUIDChange} value={username} placeholder="请输入手机号码" style={InputStyle}/>
        <Verify syncData={this.onValiChange} params={{clientType: appId, mobile: username}} style={InputStyle} sentDisabled={sentDisabled} beforeSent={this.onValiBefore}/>
        <Button className="lg primary" style={submitStyle} disabled={disabled} onClick={this.onSubmit}>登录</Button>
        {isLoading && <Loading />}
      </Page>
    );
  }
}
