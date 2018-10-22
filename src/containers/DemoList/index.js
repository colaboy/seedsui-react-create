import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Dragrefresh from 'seedsui-react/lib/Dragrefresh';
import Loading from 'seedsui-react/lib/Loading';
import {init, changeScrollTop, getList} from 'store/modules/checkFirst';
import Bridge from 'seedsui-react/lib/Bridge';
import ListItem from './ListItem';

export default
@withRouter
@connect(state => ({
  scrollTop: state.checkFirst.scrollTop,
  isLoading: state.checkFirst.isLoading,
  page: state.checkFirst.page,
  rows: state.checkFirst.rows,
  list: state.checkFirst.list,
  hasMore: state.checkFirst.hasMore
}), {
  changeScrollTop,
  init,
  getList
})
class DemoList extends Component {
  static propTypes = {
    scrollTop: PropTypes.number,
    isLoading: PropTypes.bool,
    page: PropTypes.number,
    rows: PropTypes.number,
    list: PropTypes.array,
    hasMore: PropTypes.number,
    changeScrollTop: PropTypes.func,
    init: PropTypes.func,
    getList: PropTypes.func
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.history.action === 'POP' && !this.props.isLoading) {
      if (this.$elDrag) this.$elDrag.$el.scrollTop = this.props.scrollTop;
      return;
    }
    // 加载数量
    this.props.init();
    setTimeout(() => {
      this.loadData();
    }, 100);
  }
  componentWillUnmount() {
  }
  // 记录滚动条位置
  onScroll = (e) => {
    var scrollTop = e.currentTarget.scrollTop;
    if (this.srcollTimeout) window.clearTimeout(this.srcollTimeout);
    this.srcollTimeout = setTimeout(() => {
      this.props.changeScrollTop(scrollTop);
    }, 250);
  }
  // 加载列表
  onTopRefresh = () => {
    console.log('头部刷新');
    this.loadData(false);
  }
  onBottomRefresh = () => {
    console.log('底部刷新');
    this.loadData(true);
  }
  loadData = (isNext) => {
    // 分页
    let page = this.props.page;
    if (isNext) {
      page++;
    } else {
      if (this.$elDrag) this.$elDrag.$el.scrollTop = 0;
      page = 1;
    }
    const params = {
      page,
      rows: this.props.rows
    };
    // 获得数据
    this.props.getList(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常，请稍后再试', {mask: false});
    });
  }
  goDetail = (item) => {
    const {history} = this.props;
    history.push(`/checkFirstMonth/${item.user_id}`);
  }
  render() {
    const {isLoading, list} = this.props;
    return (
      <Page>
        <Header>
          <Titlebar caption="返利红包初审"/>
        </Header>
        <Dragrefresh ref={(el) => {this.$elDrag = el;}} onScroll={this.onScroll} hasMore={this.props.hasMore} onTopRefresh={this.onTopRefresh} onBottomRefresh={this.onBottomRefresh}>
          <ListItem list={list} onClick={this.goDetail}/>
        </Dragrefresh>
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>
    );
  }
}
