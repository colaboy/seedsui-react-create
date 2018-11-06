import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Container from 'seedsui-react/lib/Container';
import List from 'seedsui-react/lib/List';
import Group from 'seedsui-react/lib/Group';
import Loading from 'seedsui-react/lib/Loading';
import Notice from 'seedsui-react/lib/Notice';
import Bridge from 'seedsui-react/lib/Bridge';
import {getDetail} from 'store/modules/reportDetailCode';

const ItemStyle = {
  marginTop: '6px'
};

export default
@withRouter
@connect(state => ({
  isLoading: state.reportDetailCode.isLoading,
  detail: state.reportDetailCode.detail,
  hasMore: state.reportDetailCode.hasMore
}), {
  getDetail
})
class ReportDetailCode extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    hasMore: PropTypes.number,
    detail: PropTypes.array,
    getDetail: PropTypes.func
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.loadData();
  }
  componentWillUnmount() {
  }
  loadData = () => {
    const params = {
      id: this.props.match.params.id
    };
    // 获得数据
    this.props.getDetail(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常, 请稍后再试', {mask: false});
    });
  }
  render() {
    const {isLoading, hasMore, detail} = this.props;
    return (
      <Page>
        <Header>
          <Titlebar caption="物流码占用结果"/>
        </Header>
        <Container>
          <Group style={{padding: '1px 0', marginTop: '-1px'}}>
            <List caption={`共扫码${detail.length}条数据:`} style={{backgroundColor: '#fff9e1', color: '#666666'}} className="border-b"/>
            {detail.map((item,index) => {
              return <List key={index} caption={item.wine_code} className="border-b" style={{padding: '10px 12px 10px 0', marginLeft: '12px'}} captionClassName="font-size-lg" containerAfter={
                <div>
                  <p className="color-sub" style={ItemStyle}>是否占用: {item.is_used === '1' ? '是' : '否'}</p>
                  <p className="color-sub" style={ItemStyle}>状态: {item.is_reversed === '1' ? '占用成功!' : '占用失败!'}</p>
                  <p className="color-sub" style={ItemStyle}>关联宴会编号: {item.banquet_code}</p>
                </div>
              }/>
            })}
          </Group>
        </Container>
        {hasMore === 404 &&  <Notice caption="暂无数据" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {hasMore === -1 &&  <Notice caption="请求错误,请稍后重试" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>
    );
  }
}
