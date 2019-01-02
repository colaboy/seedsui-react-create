import React, { Component } from 'react';
import {withRouter} from 'react-router';
import Notice from 'seedsui-react/lib/Notice';
import Button from 'seedsui-react/lib/Button';
import LocalBridge from 'utils/LocalBridge';

export default
@withRouter
class Exception extends Component {
  goLogin = () => {
    LocalBridge.logOut('', this.props.history);
  }
  render() {
    const {msg} = this.props.match.params;
    return (
      <Notice caption={msg} iconParams={{className: 'notice-icon-error'}}>
        <Button className="md primary" style={{width: '100px', margin: '20px auto 0 auto', borderRadius: '4px'}} onClick={this.goLogin}>重新登录</Button>
      </Notice>
    );
  }
}
