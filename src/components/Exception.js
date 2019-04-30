import React, { Component } from 'react';
import {withRouter} from 'react-router';
import Notice from 'seedsui-react/lib/Notice';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Button from 'seedsui-react/lib/Button';
import LocalBridge from 'utils/LocalBridge';

export default
@withRouter
class Exception extends Component {
  goLogin = () => {
    LocalBridge.logOut('', this.props.history);
  }
  render() {
    const {msg, op} = this.props.match.params;
    return (
      [<Notice key="notice" caption={msg && msg !== 'null' ? msg : '系统错误'} iconParams={{className: 'notice-icon-error'}}>
        {op === 'reLogin' && <Button className="md primary" style={{width: '100px', margin: '20px auto 0 auto', borderRadius: '4px'}} onClick={this.goLogin}>重新登录</Button>}
      </Notice>,
      op === 'back' && <Titlebar key="titlebar" caption=""/>
      ]
    );
  }
}
