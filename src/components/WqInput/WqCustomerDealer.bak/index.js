import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {createPortal} from 'react-dom';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Dragrefresh from 'seedsui-react/lib/Dragrefresh';
import Loading from 'seedsui-react/lib/Loading';
import ApiAxios from 'seedsui-react/lib/ApiAxios';
import Bridge from 'seedsui-react/lib/Bridge';
import List from 'seedsui-react/lib/List';
import Group from 'seedsui-react/lib/Group';
import Checkbox from 'seedsui-react/lib/Checkbox';

export default
@withRouter
class WqCustomerDealer extends Component {
  static propTypes = {
    portal: PropTypes.object,
    url: PropTypes.string,
    params: PropTypes.object, // store: 终端ID
    multiple: PropTypes.bool, // 是否需要多选
    selectedIds: PropTypes.string, // 传入选中的id集合
    syncData: PropTypes.func // 'error', args
  };
  static defaultProps = {
    url: '/app/jnc/banquet/getDealer.do'
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      list: [],
      selectedMap: {} // 选中值
    };
  }
  componentDidMount = () => {
    this.loadData();
  }
  componentWillUnmount() {
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
  loadData = () => {
    this.setState({
        hasMore: -2,
        isLoading: true
      },
      () => {
        const {params} = this.props;
        const data =  {
          store: '',
          status: '1'
        };
        this.requestData(params ?  params : data)
      }
    );
  }
  requestData = (params) => {
    // ApiAxios.post(this.props.url, {
    //   data: params,
    //   head: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // })
    if (!params.store) {
      Bridge.showToast('终端id store不能为空!', {mask: false});
      this.props.history.go(-1);
      return;
    }
    ApiAxios.post(this.props.url, {
      data: params
    }).then(result => {
      // 设置数据
      const list = result.dealer;
      let hasMore = 0;
      // 判断是否暂无数据
      if (list.length === 0) hasMore = 404;
      else hasMore = 0;
      this.setState({
        list: list,
        isLoading: false,
        hasMore: hasMore
      }, () => {
        this.defaultSelectedMap();
      });
    }).catch(() => {
      Bridge.showToast('请求经销商列表异常, 请稍后重试', {mask: false});
      this.setState({
        isLoading: false,
        hasMore: -1
      })
    });
  }
  // 设置选中列表
  defaultSelectedMap = () => {
    if (!this.props.multiple || !this.state.list.length) return [];
    const {selectedIds} = this.props;
    const {list} = this.state;
    const selectedMap = {};
    if (selectedIds && list.length) {
      for (var item of list) {
        for (var id of selectedIds.split(',')) {
          if (item.id === id) {
            selectedMap[id] = item;
          }
        }
      }
    }
    if (selectedMap && !Object.isEmptyObject(selectedMap)) {
      this.setState({
        selectedMap: selectedMap
      });
    }
  }
  // 提交
  onClickAdd = (item) => {
    let selectedMap = Object.clone(this.state.selectedMap);
    if (!this.props.multiple) {
      selectedMap = {
        [item.id]: item
      }
    } else {
      if (selectedMap[item.id]) {
        delete selectedMap[item.id];
      } else {
        selectedMap[item.id] = item;
      }
    }
    this.setState({
      selectedMap: selectedMap
    },
    () => {
      if (!this.props.multiple) this.onSubmit();
    })
  }
  onSubmit = () => {
    let selected = this.state.selectedMap;
    if (selected && !Object.isEmptyObject(selected)) {
      selected = Object.values(selected);
    }
    const {syncData} = this.props;
    if (syncData) syncData('', Object.values(selected));
    this.props.history.go(-1);
  }
  render() {
    const {isLoading, list, selectedMap} = this.state;
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="经销商" rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
        </Header>
        <Dragrefresh ref={(el) => {this.$elDrag = el;}} hasMore={this.state.hasMore} onTopRefresh={this.onTopRefresh} onBottomRefresh={this.onBottomRefresh} noDataCaption="暂未查询人员">
          {list && list.length > 0 && 
          <Group style={{marginTop: '-1px'}}>
            {list.map((item, index) => {
              return <List
                  licon={<Checkbox readOnly checked={!!selectedMap[item.id]}/>}
                  key={`item${index}`}
                  args={item}
                  onClick={this.onClickAdd}
                  className="flex-middle border-b"
                  caption={item.name}
                  captionStyle={{marginLeft: '6px'}}
                />
            })}
          </Group>
          }
        </Dragrefresh>
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>,
      this.props.portal || document.getElementById('root')
    );
  }
}
