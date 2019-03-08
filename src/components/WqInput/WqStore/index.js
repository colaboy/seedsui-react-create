import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Container from 'seedsui-react/lib/Container';
import Loading from 'seedsui-react/lib/Loading';
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import Bridge from 'seedsui-react/lib/Bridge';
import Notice from 'seedsui-react/lib/Notice';
import ListItem from './ListItem';

export default class WqStore extends Component {
  static propTypes = {
    url: PropTypes.string,
    params: PropTypes.object, // 参数: 无
    multiple: PropTypes.bool, // 是否需要多选
    selectedMap: PropTypes.object, // {id: item, id: item}
    onSubmit: PropTypes.func, // 'error', args
    onHide: PropTypes.func, // 隐藏时调用
  };
  static defaultProps = {
    url: '/app/order/client/v2/getStoreHouses.action',
    params: {}
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      tabActiveIndex: 0,
      selectedMap: props.selectedMap,
      // 数据
      hasMore: -2,
      list: [],
    };
  }
  componentDidMount = () => {
    this.loadData();
  }
  componentWillUnmount() {
  }
  // 获取列表的基本方法
  getList = (params) => {
    const {url} = this.props;
    // 初始化
    this.setState({
      hasMore: -2,
      isLoading: true
    });

    let list = [];
    let hasMore = -2;
    return new Promise((resolve) => {
      ApiAxios.post(url, {
        head: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: Object.params(params)
      }).then((result) => {
        if (result.code === '1') {
          list = result.datas;
          hasMore = 0;
          // 判断是否暂无数据
          if (list.length === 0) hasMore = 404;
        } else {
          hasMore = -1;
        }
        // 设置状态
        this.setState({
          list: list,
          hasMore: hasMore,
          isLoading: false
        });
        // resolve结果
        resolve(result)
      }).catch((err) => {
        Bridge.showToast(`获取仓库列表异常, 请稍后再试`, {mask: false});
        this.setState({
          isLoading: false
        });
      })
    });
  }
  // 仓库列表
  loadData = () => {
    let {params} = this.props;
    this.getList(params);
  }
  
  // 点击返回
  onBack = () => {
    if (this.props.onHide) this.props.onHide();
  }
  // 选中or删除
  onChecked = (item) => {
    if (!this.props.multiple) {
      this.setState({
        selectedMap: {[item.id]: item}
      }, () => {
        this.onSubmit();
      });
      return;
    }
    let {selectedMap} = this.state;
    if (selectedMap[item.id]) {
      delete selectedMap[item.id];
    } else {
      selectedMap[item.id] = item;
    }
    this.setState({
      selectedMap: selectedMap
    });
  }
  onSubmit = () => {
    const {selectedMap} = this.state;
    if (this.props.onSubmit) this.props.onSubmit('', selectedMap);
  }
  render() {
    const {
      isLoading,
      selectedMap,
      hasMore, list
    } = this.state;
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="选择仓库" onClickBack={this.onBack} rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
        </Header>
        <Container>
          <ListItem
            multiple={this.props.multiple}
            ref={el => {this.$storePage = el;}}
            selectedMap={selectedMap}
            checkbox
            // 分页
            list={list}
            onChecked={this.onChecked}
          />
        </Container>
        {hasMore === 404 && <Notice caption="暂无数据" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>,
      document.getElementById('root')
    );
  }
}
