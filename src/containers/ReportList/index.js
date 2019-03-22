import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Dragrefresh from 'seedsui-react/lib/Dragrefresh';
import Loading from 'seedsui-react/lib/Loading';
import {init, changeScrollTop, getList, changeFilter} from 'store/modules/reportList';
import Bridge from 'seedsui-react/lib/Bridge';
import DB from 'seedsui-react/lib/DB';
import ListItem from './ListItem';
import Filter from './Filter';

export default
@withRouter
@connect(state => ({
  scrollTop: state.reportList.scrollTop,
  isLoading: state.reportList.isLoading,
  page: state.reportList.page,
  rows: state.reportList.rows,
  list: state.reportList.list,
  hasMore: state.reportList.hasMore,
  // 过滤条件
  banquetTypeList: state.reportList.banquetTypeList,
  banquetTypeName: state.reportList.banquetTypeName,
  banquetType: state.reportList.banquetType,
  banquetStatusList: state.reportList.banquetStatusList,
  banquetStatusName: state.reportList.banquetStatusName,
  banquetStatus: state.reportList.banquetStatus,
  storeName: state.reportList.storeName,
  storeId: state.reportList.storeId,
  creatimeStart: state.reportList.creatimeStart,
  createTimeEnd: state.reportList.createTimeEnd,
  creatorName: state.reportList.creatorName,
  banquetDate: state.reportList.banquetDate,
  endDate: state.reportList.endDate
}), {
  changeScrollTop,
  init,
  getList,
  changeFilter
})
class ReportList extends Component {
  static propTypes = {
    scrollTop: PropTypes.number,
    isLoading: PropTypes.bool,
    page: PropTypes.number,
    rows: PropTypes.number,
    list: PropTypes.array,
    hasMore: PropTypes.number,
    // 过滤条件
    banquetTypeList: PropTypes.array,
    banquetTypeName: PropTypes.string,
    banquetType: PropTypes.string,
    banquetStatusList: PropTypes.array,
    banquetStatusName: PropTypes.string,
    banquetStatus: PropTypes.string,
    storeName: PropTypes.string,
    storeId: PropTypes.string,
    creatimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    creatorName: PropTypes.string,
    banquetDate: PropTypes.string,
    endDate: PropTypes.string,
    changeScrollTop: PropTypes.func,
    init: PropTypes.func,
    getList: PropTypes.func,
    changeFilter: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      filterShow: false
    }
  }
  componentDidMount() {
    if (this.props.history.action === 'POP' && !this.props.isLoading && !DB.getSession('listrefresh')) {
      console.log('不刷新返回');
      if (this.$elDrag) this.$elDrag.$el.scrollTop = this.props.scrollTop;
      return;
    }
    DB.setSession('listrefresh', '');
    // 加载数据
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
      pproveStatus: this.props.pproveStatus,
      banquetDate: this.props.banquetDate,
      banquetType: this.props.banquetType,
      createTimeEnd: this.props.createTimeEnd,
      creatimeStart: this.props.creatimeStart,
      creatorName: this.props.creatorName,
      endDate: this.props.endDate,
      storeId: this.props.storeId,
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
  // 过滤
  onFilterShow = () => {
    this.setState({
      filterShow: !this.state.filterShow
    });
  }
  onFilterHide = () => {
    this.setState({
      filterShow: false
    });
  }
  onFilterSubmit = () => {
    this.loadData(false);
    this.setState({
      filterShow: false
    });
  }
  // 进入新增页面
  goAdd = () => {
    this.props.history.push('/reportEdit?isFromApp=confirm');
  }
  render() {
    const {isLoading, list,
      changeFilter,
      // 过滤条件
      banquetTypeList,
      banquetTypeName,
      banquetType,
      banquetStatusList,
      banquetStatusName,
      banquetStatus,
      storeName,
      storeId,
      creatimeStart,
      createTimeEnd,
      creatorName,
      banquetDate,
      endDate
    } = this.props;
    let rBtns = [];
    rBtns.push({
      iconClassName: 'icon-rdo-plus',
      onClick: this.goAdd
    });
    if (!isLoading) {
      rBtns.push({
        iconClassName: 'icon-filter-menu',
        onClick: this.onFilterShow
      });
    }
    return (
      <Page>
        <Header>
          <Titlebar caption="宴会报备" rButtons={rBtns}/>
        </Header>
        <Dragrefresh ref={(el) => {this.$elDrag = el;}} onScroll={this.onScroll} hasMore={this.props.hasMore} onTopRefresh={this.onTopRefresh} onBottomRefresh={this.onBottomRefresh}>
          <ListItem list={list}/>
        </Dragrefresh>
        <Filter
          portal={document.getElementById('root')}
          show={this.state.filterShow}
          onHide={this.onFilterHide}
          onSubmit={this.onFilterSubmit}
          onChange={changeFilter}
          // 过滤条件
          banquetTypeList={banquetTypeList}
          banquetTypeName={banquetTypeName}
          banquetType={banquetType}
          banquetStatusList={banquetStatusList}
          banquetStatusName={banquetStatusName}
          banquetStatus={banquetStatus}
          storeName={storeName}
          storeId={storeId}
          creatimeStart={creatimeStart}
          createTimeEnd={createTimeEnd}
          creatorName={creatorName}
          banquetDate={banquetDate}
          endDate={endDate}
        />
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>
    );
  }
}
