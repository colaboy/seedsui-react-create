import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Route, withRouter} from 'react-router';
import {connect} from 'react-redux';
import {init, changeScrollTop, changeFilter, getList, saveEnd} from 'store/modules/checkEnd';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Footer from 'seedsui-react/lib/Footer';
import Button from 'seedsui-react/lib/Button';
import Dragrefresh from 'seedsui-react/lib/Dragrefresh';
import Bridge from 'seedsui-react/lib/Bridge';
import Loading from 'seedsui-react/lib/Loading';
import DB from 'seedsui-react/lib/DB';
import Filter from '../CheckFirst/Filter';
import ListItem from './ListItem';
import RouteComment from 'seedsui-react/lib/RouteComment';

export default
@withRouter
@connect(state => ({
  // 过滤条件
  cm_id: state.checkEnd.cm_id, //	客户id	string
  cm_type: state.checkEnd.cm_type, //	客户类型	string
  district_ids: state.checkEnd.district_ids, //	销售区域	string	逗号分隔
  submit_manager_id: state.checkEnd.submit_manager_id, //	客户经理id	string
  jxs_id: state.checkEnd.jxs_id, //	供货商	string
  cm_name: state.checkEnd.cm_name,
  cm_type_name: state.checkEnd.cm_type_name,
  district_name: state.checkEnd.district_name,
  submit_manager_name: state.checkEnd.submit_manager_name,
  jxs_name: state.checkEnd.jxs_name,
  // 页面
  tabActiveIndex: state.checkEnd.tabActiveIndex,
  tabs: state.checkEnd.tabs,
  isLoading: state.checkEnd.isLoading,
  rows: state.checkEnd.rows,
  page: state.checkEnd.page,
  list: state.checkEnd.list,
  hasMore: state.checkEnd.hasMore,
  // 滚动条
  scrollTop: state.checkEnd.scrollTop
}), {
  init,
  changeScrollTop,
  changeFilter,
  getList,
  saveEnd
})
class CheckEnd extends Component {
  static propTypes = {
    // 过滤条件
    cm_id: PropTypes.string,
    cm_type: PropTypes.string,
    district_ids: PropTypes.string,
    submit_manager_id: PropTypes.string,
    jxs_id: PropTypes.string,
    cm_name: PropTypes.string,
    cm_type_name: PropTypes.string,
    district_name: PropTypes.string,
    submit_manager_name: PropTypes.string,
    jxs_name: PropTypes.string,
    // 页面
    isLoading: PropTypes.bool,
    rows: PropTypes.number,
    page: PropTypes.number,
    list: PropTypes.array,
    hasMore: PropTypes.number,
    // 滚动条
    scrollTop: PropTypes.number,
    // 方法
    init: PropTypes.func,
    changeScrollTop: PropTypes.func,
    changeFilter: PropTypes.func,
    getList: PropTypes.func,
    saveEnd: PropTypes.func
  }
  static defaultProps = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      filterShow: false
    }
  }
  componentDidMount = () => {
    // 注册给客户端调用的返回事件
    Bridge.addBackPress();
    // 如果是返回,则不刷新数据
    if (this.props.history.action === 'POP' && !this.props.isLoading && !DB.getSession('listrefresh')) {
      console.log('不刷新返回');
      if (this.$elDrag) this.$elDrag.$el.scrollTop = this.props.scrollTop;
      return;
    }
    DB.setSession('listrefresh', '');
    // 初始化
    this.props.init();
    setTimeout(() => {
      this.loadList();
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
  onListTopRefresh = () => {
    console.log('头部刷新');
    this.loadList(false);
  }
  onListBottomRefresh = () => {
    console.log('底部刷新');
    this.loadList(true);
  }
  loadList = (isNext) => {
    let page = this.props.page;
    if (isNext) {
      page++;
    } else {
      page = 1;
    }
    const params = {
      page: page,
      rows: this.props.rows,
      approve_status: '0',	// 审批状态	string	0待审批 1已审批
      cm_id: this.props.cm_id, //	客户id	string	
      cm_type: this.props.cm_type, //	客户类型	string	
      district_ids: this.props.district_ids, //	销售区域	string	逗号分隔
      submit_manager_id: this.props.submit_manager_id, //	客户经理id	string	
      jxs_id: this.props.jxs_id, //	供货商	string	
    };
    this.props.getList(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('请求列表异常，请稍后再试', {mask: false});
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
    this.loadList(false);
    this.setState({
      filterShow: false
    });
  }
  // 进入详情
  goDetail = (item) => {
    const {history} = this.props;
    history.push(`/checkDetail/2/${item.ids}`);
  }
  // 批量审批
  onEndApproverPop = () => {
    this.props.history.push(`/checkEnd/endApproverPop`);
  }
  onEndApproverCancel = (value) => {
    // 打回时必须输入
    if (!value.replace(/\s*/g, '')) {
      Bridge.showToast('请输入打回原因', {mask: false});
      return;
    }
    const approveId = this.props.list.map((item) => {
      return item.ids
    });
    // 保存
    this.saveEnd({
      approve_id: approveId.join(','),
      approve_opinion: value,
      approve_type: '2'
    }, '打回成功');
  }
  onEndApproverSubmit = (value, obj) => {
    const approveId = this.props.list.map((item) => {
      return item.ids
    });
    // 保存
    this.saveEnd({
      approve_id: approveId.join(','),
      approve_opinion: value,
      approve_type: '1'
    }, '审批通过');
  }
  saveEnd = (params, msg) => {
    this.props.saveEnd(params).then((result) => {
      if (result.code === '1') {
        this.loadList(false);
        Bridge.showToast(msg || '提交成功', {
          onSuccess: () => {
            this.props.history.go(-1);
          }
        });
      } else {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常，请稍后再试', {mask: false});
    });
  }
  render() {
    const {
      changeFilter,
      isLoading, list
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
          <Titlebar caption="返利红包终审" rButtons={isLoading ? [] : rBtns}/>
        </Header>
        <Dragrefresh style={{bottom: '40px'}} ref={(el) => {this.$elDrag = el;}} onScroll={this.onScroll} hasMore={this.props.hasMore} onTopRefresh={this.onListTopRefresh} onBottomRefresh={this.onListBottomRefresh}>
          <ListItem list={list} onClick={this.goDetail}/>
        </Dragrefresh>
        {list.length > 0 && <Footer>
          <Button className="lg primary" onClick={this.onEndApproverPop}>批量审批</Button>
        </Footer>}
        <Filter
          portal={document.getElementById('root')} onSubmit={this.onFilterSubmit} onHide={this.onFilterHide} show={this.state.filterShow}
          cm_id={this.props.cm_id}
          cm_type={this.props.cm_type}
          district_ids={this.props.district_ids}
          jxs_id={this.props.jxs_id}
          submit_manager_id={this.props.submit_manager_id}
          cm_name={this.props.cm_name}
          cm_type_name={this.props.cm_type_name}
          district_name={this.props.district_name}
          submit_manager_name={this.props.submit_manager_name}
          jxs_name={this.props.jxs_name}
          onChange={changeFilter}
        />
        {isLoading && <Loading style={{top: '44px'}}/>}
        <Route
          path={`${this.props.match.path}/endApproverPop`}
          render={() => <RouteComment
            buttons={[
              {
                valid: false,
                className: 'lg bg-white',
                caption: '打回',
                onClick: this.onEndApproverCancel
              },
              {
                valid: false,
                className: 'lg primary',
                caption: '审批通过',
                onClick: this.onEndApproverSubmit
              }
            ]}
            maxLength="100"
            title="批量审核"
            placeholder="请填写审批意见"
          />}
        />
        
      </Page>
    )
  }
}
