import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Container from 'seedsui-react/lib/Container';
import Loading from 'seedsui-react/lib/Loading';
import Notice from 'seedsui-react/lib/Notice';
import Bridge from 'seedsui-react/lib/Bridge';
import {getDetail} from 'store/modules/checkDetail';

export default
@withRouter
@connect(state => ({
  isLoading: state.checkDetail.isLoading,
  detail: state.checkDetail.detail,
  hasMore: state.checkDetail.hasMore
}), {
  getDetail
})
class DemoDetail extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    hasMore: PropTypes.number,
    detail: PropTypes.object,
    getDetail: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    }
  }
  componentDidMount() {
    this.loadData();
  }
  componentWillUnmount() {
  }
  loadData = () => {
    const params = {
      approve_id: this.props.match.params.approveId
    };
    // 获得数据
    this.props.getDetail(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常，请稍后再试', {mask: false});
    });
  }
  render() {
    const {isLoading, hasMore, detail} = this.props;
    return (
      <Page>
        <Header>
          <Titlebar caption="详情"/>
        </Header>
        {detail && <Container>
        </Container>}
        {hasMore === 404 &&  <Notice caption="暂无数据" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {hasMore === -1 &&  <Notice caption="请求错误,请稍后重试" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>
    );
  }
}