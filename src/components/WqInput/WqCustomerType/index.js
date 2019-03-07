import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Tabbar from 'seedsui-react/lib/Tabbar';
import Container from 'seedsui-react/lib/Container';
import Tree from 'seedsui-react/lib/Tree';
import Load from 'components/Load';
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import Bridge from 'seedsui-react/lib/Bridge';
import Carrousel from 'seedsui-react/lib/Carrousel';

export default class WqCustomerType extends Component {
  static propTypes = {
    url: PropTypes.string,
    params: PropTypes.object, // 参数: {tradeType: '3门店,2经销商,不传都显示'}
    multiple: PropTypes.bool, // 是否需要多选
    selectedIds: PropTypes.string, // 传入选中的id集合
    onSubmit: PropTypes.func, // 'error', args
    onHide: PropTypes.func, // 隐藏时调用
  };
  static defaultProps = {
    url: '/component/getComponentData.action',
    params: {}
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      tabActiveIndex: 0,
      supplierList: [],
      customerList: []
    };
  }
  componentDidMount = () => {
    const {params} = this.props;
    if (!this.state.customerList.length && !this.state.supplierList.length) {
      if (params.tradeType === '2') {
        this.loadSupplierData();
      } else if (params.tradeType === '3') {
        this.loadCustomerData();
      } else {
        this.loadCustomerData();
      }
    }
  }
  componentWillUnmount() {
  }
  onSubmit = () => {
    if (!this.$customerTree || !this.$supplierTree) return;
    let customerSelected = this.$customerTree.instance.selected;
    let supplierSelected = this.$supplierTree.instance.selected;
    let selected = {};
    selected = Object.assign(customerSelected, supplierSelected)
    const {onSubmit} = this.props;
    if (onSubmit) onSubmit('', selected);
  }
  // 加载经销商列表
  loadSupplierData = () => {
    this.loadData('2');
  }
  // 加载门店列表
  loadCustomerData = () => {
    this.loadData('3');
  }
  // 加载数据
  loadData = (argTradeType) => {
    this.setState({
      isLoading: true
    });
    const {url} = this.props;
    const tradeType = argTradeType || '3';
    const data =  {typeCode: 'customer_type', paramValue: {trade_type: tradeType}};
    ApiAxios.post(url, {
      data: Object.params(data, 'bracket'),
      head: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(result => {
      if (result.code === '1') {
        if (result.data && !Object.isEmptyObject(result.data)) {
          let data = JSON.stringify(result.data).replace(/parent_id/mgi,"parentid");
          data = JSON.parse(data);
          this.setState({
            [tradeType === '3' ? 'customerList' : 'supplierList']: data
          })
        }
      } else {
        Bridge.showToast(result.message, {mask: false});
      }
      this.setState({
        isLoading: false
      })
    }).catch(() => {
      Bridge.showToast('请求客户类型异常, 请稍后重试', {mask: false});
      this.setState({
        isLoading: false
      })
    });
  }
  getSelectedList = () => {
    if (!this.state.customerList.length && !this.state.supplierList.length) {
      return [];
    }
    const {selectedIds} = this.props;
    if (!selectedIds || !selectedIds.length) {
      return [];
    }
    // const {params} = this.props;
    const {customerList, supplierList} = this.state;
    // 找出选中项
    let list = customerList.concat(supplierList);
    const selectedList = [];
    
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
    
    return selectedList;
  }
  // 点击添加
  onClickAdd = (opts) => {
    if (!this.props.multiple) {
      this.$customerTree.instance.removeAllSelected();
      this.$supplierTree.instance.removeAllSelected();
      if (this.state.tabActiveIndex === 0) {
        this.$customerTree.instance.addSelected(opts);
      } else {
        this.$supplierTree.instance.addSelected(opts);
      }
      this.onSubmit();
    }
  }
  // 点击删除
  onClickDel = (opts) => {
    if (!this.props.multiple) {
      this.$customerTree.instance.removeAllSelected();
      this.$supplierTree.instance.removeAllSelected();
      if (this.state.tabActiveIndex === 0) {
        this.$customerTree.instance.addSelected(opts);
      } else {
        this.$supplierTree.instance.addSelected(opts);
      }
      this.onSubmit();
    }
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
    const {tabActiveIndex, isLoading, supplierList, customerList} = this.state;
    const selectedList = this.getSelectedList();
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="选择客户类型" onClickBack={this.onBack} rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
          {tabbar && <Tabbar list={tabbar} activeIndex={tabActiveIndex} onClick={this.onClickTab}/>}
        </Header>
        {/* <Container> */}
        <Container style={{top: tabbar ? '84px' : '44px'}}>
          <Carrousel onChange={this.onCarrouselChange} activeIndex={tabActiveIndex}>
            {(!params.tradeType || params.tradeType === '3') &&
              <Tree
                multiple={this.props.multiple}
                ref={el => {this.$customerTree = el;}}
                list={customerList}
                selected={selectedList}
                checkbox
                onClickAdd={this.onClickAdd}
                onClickDel={this.onClickDel}
              />
            }
            {(!params.tradeType || params.tradeType === '2') &&
              <Tree
                multiple={this.props.multiple}
                ref={el => {this.$supplierTree = el;}}
                list={supplierList}
                selected={selectedList}
                checkbox
                onClickAdd={this.onClickAdd}
                onClickDel={this.onClickDel}
              />
            }
          </Carrousel>
        </Container>
        {isLoading && <Load style={{top: '44px'}}/>}
      </Page>,
      document.getElementById('root')
    );
  }
}
