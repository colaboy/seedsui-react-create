import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Tabbar from 'seedsui-react/lib/Tabbar';
import Container from 'seedsui-react/lib/Container';
import Loading from 'seedsui-react/lib/Loading';
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import Bridge from 'seedsui-react/lib/Bridge';
import Carrousel from 'seedsui-react/lib/Carrousel';
import ListItem from './ListItem';

export default class WqCustomer extends Component {
  static propTypes = {
    url: PropTypes.string,
    params: PropTypes.object, // 参数: {tradeType: '1客户 2经销商 3门店,默认1'}
    multiple: PropTypes.bool, // 是否需要多选
    selectedMap: PropTypes.object, // {id: item, id: item}
    onSubmit: PropTypes.func, // 'error', args
    onHide: PropTypes.func, // 隐藏时调用
  };
  static defaultProps = {
    url: '/biz/customer/client/queryCmDealerLower.action',
    params: {}
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      tabActiveIndex: 0,
      selectedMap: props.selectedMap,
      // 客户
      customerPage: 1,
      customerRows: 20,
      customerHasMore: -2,
      customerList: [],
      customerCondition: {
        queryStr: ''
      },
      // 经销商
      supplierPage: 1,
      supplierRows: 20,
      supplierHasMore: -2,
      supplierList: [],
      // 门店
      storePage: 1,
      storeRows: 20,
      storeHasMore: -2,
      storeList: [],
    };
  }
  componentDidMount = () => {
  }
  componentWillUnmount() {
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
  // 获取列表的基本方法
  getList = (params) => {
    const {url} = this.props;
    const {customerList, supplierList, storeList} = this.state;
    // 区分三种情况
    let name = '客户';
    let type = 'customer';
    let page = params.page;
    let rows = params.rows;
    let list = [];
    let hasMore = -2;
    switch (params.tradeType) {
      case '1':
        name = '客户';
        type = 'customer';
        list = customerList;
        break;
      case '2':
        name = '经销商';
        type = 'supplier';
        list = supplierList;
        break;
      case '3':
        name = '门店';
        type = 'store';
        list = storeList;
        break;
      default:
        name = '客户';
        type = 'customer';
        list = customerList;
    }

    // 初始化
    this.setState({
      [type + 'HasMore']: -2,
      isLoading: true
    });

    return new Promise((resolve) => {
      ApiAxios.post(url, {
        head: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: Object.params(params)
      }).then((result) => {
        if (result.code === '1') {
          const serList = result.data;
          list = page === 1 ? serList : list.concat(serList);
          // 判断0.无更多数据, 1.头部刷新完成, 2.底部刷新完成, 404.一条数据都没有
          hasMore = page === 1 ? 1 : 2;
          // 判断是否无更多数据
          if (rows > serList.length) hasMore = 0;
          // 判断是否暂无数据
          if (list.length === 0) hasMore = 404;
        } else {
          hasMore = -1;
        }
        // 设置状态
        this.setState({
          [type + 'Page']: page,
          [type + 'List']: list,
          [type + 'HasMore']: hasMore,
          isLoading: false
        });
        // resolve结果
        resolve(result)
      }).catch((err) => {
        Bridge.showToast(`获取${name}数据异常，请稍后再试`, {mask: false});
        this.setState({
          isLoading: false
        });
      })
    });
  }
  // 客户列表
  loadCustomerData = (isNext) => {
    let {params} = this.props;
    let {customerPage, customerRows, customerCondition} = this.state;
    // 分页
    if (isNext) {
      customerPage++;
    } else {
      customerPage = 1;
    }
    params = Object.assign(params, {
      queryStr: customerCondition.queryStr,
      page: customerPage,
      rows: customerRows
    });
    // 获得数据
    this.getList(params);
  }
  changeCustomerFilter = (condition) => {
    let {customerCondition} = this.state;
    for (let cond in condition) {
      if (condition[cond] !== undefined) {
        customerCondition[cond] = condition[cond];
      }
    }
    this.setState({
      customerCondition: customerCondition
    });
  }
  // 经销商列表
  loadSupplierData = (isNext) => {
    let {params} = this.props;
    let {supplierPage, supplierRows} = this.state;
    // 分页
    if (isNext) {
      supplierPage++;
    } else {
      supplierPage = 1;
    }
    params = Object.assign(params, {
      page: supplierPage,
      rows: supplierRows
    });
    // 获得数据
    this.getList(params);
  }
  // 门店列表
  loadStoreData = (isNext) => {
    let {params} = this.props;
    let {storePage, storeRows} = this.state;
    // 分页
    if (isNext) {
      storePage++;
    } else {
      storePage = 1;
    }
    params = Object.assign(params, {
      page: storePage,
      rows: storeRows
    });
    // 获得数据
    this.getList(params);
  }
  
  // 点击返回
  onBack = () => {
    if (this.props.onHide) this.props.onHide();
  }
  // 切换tab页
  onCarrouselChange = (e) => {
    this.setState({
      tabActiveIndex: e.activeIndex
    })
    if (e.activeIndex === 1) {
      if (!this.supplierLoaded) {
        this.loadSupplierData(false);
        this.supplierLoaded = true;
      }
    }
  }
  onClickTab = (item) => {
    let tabActiveIndex = 0;
    if (item.id === '2') {
      tabActiveIndex = 1;
    }
    this.setState({
      tabActiveIndex
    })
  }
  render() {
    const {params} = this.props;
    let tabbar = null;
    if (!params.tradeType) {
      tabbar = [
        {
          id: '3',
          caption: '门店'
        },
        {
          id: '2',
          caption: '经销商'
        }
      ]
    }
    const {
      tabActiveIndex, isLoading,
      selectedMap,
      customerPage, customerRows, customerHasMore, customerList,
      supplierPage, supplierRows, supplierHasMore, supplierList,
      storePage, storeRows, storeHasMore, storeList
    } = this.state;
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="选择客户" onClickBack={this.onBack} rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
          {tabbar && <Tabbar list={tabbar} activeIndex={tabActiveIndex} onClick={this.onClickTab}/>}
        </Header>
        {/* <Container> */}
        <Container style={{top: tabbar ? '84px' : '44px'}}>
          <Carrousel onChange={this.onCarrouselChange} activeIndex={tabActiveIndex}>
            {(!params.tradeType || params.tradeType === '3') &&
              <ListItem
                multiple={this.props.multiple}
                ref={el => {this.$storePage = el;}}
                selectedMap={selectedMap}
                checkbox
                // 分页
                page={storePage}
                rows={storeRows}
                hasMore={storeHasMore}
                loadData={this.loadStoreData}
                list={storeList}
                onClickAdd={this.onClickAdd}
                onClickDel={this.onClickDel}
              />
            }
            {(!params.tradeType || params.tradeType === '2') &&
              <ListItem
                multiple={this.props.multiple}
                ref={el => {this.$supplierPage = el;}}
                selectedMap={selectedMap}
                checkbox
                // 分页
                page={supplierPage}
                rows={supplierRows}
                hasMore={supplierHasMore}
                loadData={this.loadSupplierData}
                list={supplierList}
                onClickAdd={this.onClickAdd}
                onClickDel={this.onClickDel}
              />
            }
            {(params.tradeType === '1') &&
              <ListItem
                multiple={this.props.multiple}
                ref={el => {this.$customerPage = el;}}
                selectedMap={selectedMap}
                checkbox
                onChecked={this.onChecked}
                // 分页
                page={customerPage}
                rows={customerRows}
                hasMore={customerHasMore}
                loadData={this.loadCustomerData}
                list={customerList}
                // 过滤条件
                changeFilter={this.changeCustomerFilter}
              />
            }
          </Carrousel>
        </Container>
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>,
      document.getElementById('root')
    );
  }
}
