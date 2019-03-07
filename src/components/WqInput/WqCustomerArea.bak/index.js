import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Container from 'seedsui-react/lib/Container';
import Tree from 'seedsui-react/lib/Tree';
import Loading from 'seedsui-react/lib/Loading';
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import Bridge from 'seedsui-react/lib/Bridge';
import Notice from 'seedsui-react/lib/Notice';

export default class WqCustomerArea extends Component {
  static propTypes = {
    portal: PropTypes.object,
    url: PropTypes.string,
    params: PropTypes.object, // 3门店,2经销商,不传都显示
    multiple: PropTypes.bool, // 是否需要多选
    selectedIds: PropTypes.string, // 传入选中的id集合
    syncData: PropTypes.func, // 'error', args
  };
  static defaultProps = {
    url: '/app/cm/weixin/districtTreeData.action'
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      hasMore: -2,
      list: []
    };
  }
  componentDidMount = () => {
    this.loadData();
  }
  componentWillUnmount() {
  }
  // 矫正数据
  converList = (list) => {
    var listStr = JSON.stringify(list).replace(/pId/gim, 'parentid').replace(/text/gim, 'name');
    return JSON.parse(listStr).flattenTree();
  }
  // 加载数据
  loadData = () => {
    this.setState({
      isLoading: true
    });
    const {url, params} = this.props;
    const data =  {'query.tradeType': '3'};
    ApiAxios.post(url, {
      data: params || data,
      head: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(result => {
      if (Array.isArray(result) && result.length > 0) {
        this.setState({
          list: this.converList(result),
          isLoading: false,
          hasMore: 0
        });
      } else {
        this.setState({
          isLoading: false,
          hasMore: 404
        });
        Bridge.showToast('区域为空', {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('请求区域异常, 请稍后重试', {mask: false});
      this.setState({
        isLoading: false,
        hasMore: -1
      })
    });
  }
  // 根据selectedList获取选中列表
  getSelectedList = () => {
    if (!this.props.multiple || !this.state.list.length) return [];
    const selectedList = [];
    const {selectedIds} = this.props;
    const {list} = this.state;
    if (selectedIds && list.length) {
      for (var item of list) {
        for (var id of selectedIds.split(',')) {
          if (item.id === id) {
            selectedList.push({
              id: item.id,
              name: item.name,
              parentid: item.parentid
            })
          }
        }
      }
    }
    return selectedList;
  }
  // 提交
  onClickAdd = () => {
    if (!this.props.multiple) this.onSubmit();
  }
  onSubmit = () => {
    let selected = this.$listTree.instance.selected;
    if (selected && !Object.isEmptyObject(selected)) {
      selected = Object.values(selected);
    }
    const {syncData} = this.props;
    if (syncData) syncData('', selected);
    history.go(-1);
  }
  render() {
    const {isLoading, list} = this.state;
    const selectedList = this.getSelectedList();
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="区域选择" rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
        </Header>
        <Container>
          {list && list.length > 0 && <Tree ref={el => {this.$listTree = el;}} list={list} selected={selectedList} checkbox onClickAdd={this.onClickAdd}/>}
        </Container>
        {this.state.hasMore === 404 && <Notice caption="暂无数据" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>,
      this.props.portal || document.getElementById('root')
    );
  }
}
