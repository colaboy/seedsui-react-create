import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {init, changeScrollTop, changeFilter, changeActiveTab, getList1, getList2} from 'store/modules/demoListCarrousel';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Carrousel from 'seedsui-react/lib/Carrousel';
import Tabbar from 'seedsui-react/lib/Tabbar';
import Dragrefresh from 'seedsui-react/lib/Dragrefresh';
import Bridge from 'seedsui-react/lib/Bridge';
import Loading from 'seedsui-react/lib/Loading';
import Filter from './Filter';
import ListItem from './ListItem';

export default
@withRouter
@connect(state => ({
  // 过滤条件
  cmName: state.demoListCarrousel.cmName,
  // 其它
  tabActiveIndex: state.demoListCarrousel.tabActiveIndex,
  tabs: state.demoListCarrousel.tabs,
  isLoading: state.demoListCarrousel.isLoading,
  rows: state.demoListCarrousel.rows,
  list1Page: state.demoListCarrousel.list1Page,
  list1: state.demoListCarrousel.list1,
  list1HasMore: state.demoListCarrousel.list1HasMore,
  list2Page: state.demoListCarrousel.list2Page,
  list2: state.demoListCarrousel.list2,
  list2HasMore: state.demoListCarrousel.list2HasMore,
}), {
  init,
  changeScrollTop,
  changeFilter,
  getList1,
  getList2,
  changeActiveTab
})
class DemoListCarrousel extends Component {
  static propTypes = {
    cmName: PropTypes.string,
    tabActiveIndex: PropTypes.number,
    tabs: PropTypes.array,
    isLoading: PropTypes.bool,
    rows: PropTypes.number,
    list1Page: PropTypes.number,
    list1: PropTypes.array,
    list1HasMore: PropTypes.number,
    list2Page: PropTypes.number,
    list2: PropTypes.array,
    list2HasMore: PropTypes.number,
    init: PropTypes.func,
    changeScrollTop: PropTypes.func,
    changeFilter: PropTypes.func,
    getList1: PropTypes.func,
    getList2: PropTypes.func,
    changeActiveTab: PropTypes.func
  }
  static defaultProps = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      filterShow: false,
      speed: 300 // 轮播页的动画速度
    }
  }
  componentDidMount = () => {
    // 注册给客户端调用的返回事件
    Bridge.addBackPress();
    // 如果是返回,则不刷新数据
    if (this.props.history.action === 'POP' && !this.props.isLoading) {
      if (this.props.tabActiveIndex === 1) {
        this.setState({
          speed: 0
        });
        if (this.$elDrag2) this.$elDrag2.$el.scrollTop = this.props.scrollTop;
        setTimeout(() => {
          this.setState({
            speed: 300
          });
        }, 300);
      } else {
        if (this.$elDrag1) this.$elDrag1.$el.scrollTop = this.props.scrollTop;
      }
      return;
    }
    // 初始化
    this.props.init();
    setTimeout(() => {
      this.loadList1();
    }, 100);
  }
  componentWillUnmount() {
    // 移除给客户端调用的返回事件
    Bridge.removeBackPress();
  }
  // 记录滚动条位置
  onScroll = (e) => {
    var scrollTop = e.currentTarget.scrollTop;
    if (this.srcollTimeout) window.clearTimeout(this.srcollTimeout);
    this.srcollTimeout = setTimeout(() => {
      this.props.changeScrollTop(scrollTop);
    }, 250);
  }
  // 加载第1页列表
  onList1TopRefresh = () => {
    console.log('头部刷新');
    this.loadList1(false);
  }
  onList1BottomRefresh = () => {
    console.log('底部刷新');
    this.loadList1(true);
  }
  loadList1 = (isNext) => {
    let page = this.props.list1Page;
    if (isNext) {
      page++;
    } else {
      page = 1;
    }
    const params = {
      page: page,
      rows: this.props.rows
    };
    this.props.getList1(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('请求列表异常，请稍后再试', {mask: false});
    });
  }
  // 加载第2页列表
  onList2TopRefresh = () => {
    console.log('头部刷新');
    this.loadList2(false);
  }
  onList2BottomRefresh = () => {
    console.log('底部刷新');
    this.loadList2(true);
  }
  loadList2 = (isNext) => {
    let page = this.props.list1Page;
    if (isNext) {
      page++;
    } else {
      page = 1;
    }
    const params = {
      page: page,
      rows: this.props.rows
    };
    this.props.getList2(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('请求列表异常，请稍后再试', {mask: false});
    });
  }
  // 切换tab页
  onCarrouselChange = (e) => {
    this.props.changeActiveTab(e.activeIndex);
    if (e.activeIndex === 1) { // 加载已使用
      if (!this.list2loaded) {
        this.loadList2(false);
        this.list2loaded = true;
      }
    }
  }
  onClickTab = (e, index) => {
    this.props.changeActiveTab(index);
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
    if (this.props.activeIndex === 1) {
      this.loadList2(false);
    } else {
      this.loadList1(false);
    }
    this.setState({
      filterShow: false
    });
  }
  // 进入详情
  goDetail = (item) => {
    const {history} = this.props;
    history.push(`/checkFirstMonth/${item.user_id}`);
  }
  render() {
    const {
      cmName, changeFilter,
      isLoading, tabs, tabActiveIndex,
      list1HasMore, list2HasMore,
      list1, list2
    } = this.props;
    const rBtns = isLoading ? null : [
      {
        iconClassName: 'icon-filter-menu',
        onClick: this.onFilterShow
      }
    ];
    return (
      <Page>
        <Header>
          <Titlebar caption="轮播列表" rButtons={isLoading ? [] : rBtns}/>
          <Tabbar tiled style={{height: '40px', backgroundColor: '#f8f8f8'}} list={tabs} activeIndex={tabActiveIndex} onClick={this.onClickTab}/>
        </Header>
        <Carrousel speed={this.state.speed} style={{top: '84px'}} onChange={this.onCarrouselChange} activeIndex={this.props.tabActiveIndex}>
          <Dragrefresh ref={(el) => {this.$elDrag1 = el;}} onScroll={this.onScroll} hasMore={list1HasMore} onTopRefresh={this.onList1TopRefresh} onBottomRefresh={this.onList1BottomRefresh}>
            <ListItem list={list1} onClick={this.goDetail}/>
          </Dragrefresh>
          <Dragrefresh ref={(el) => {this.$elDrag2 = el;}} onScroll={this.onScroll} hasMore={list2HasMore} onTopRefresh={this.onList2TopRefresh} onBottomRefresh={this.onList2BottomRefresh}>
            <ListItem list={list2} onClick={this.goDetail}/>
          </Dragrefresh>
        </Carrousel>
        <Filter
          portal={document.getElementById('root')} onSubmit={this.onFilterSubmit} onHide={this.onFilterHide} show={this.state.filterShow}
          cmName={cmName}
          onChange={changeFilter}
        />
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>
    )
  }
}
