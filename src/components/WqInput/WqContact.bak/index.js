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
import IndexBar from 'seedsui-react/lib/IndexBar';
import Checkbox from 'seedsui-react/lib/Checkbox';
import WqContactSearch from './../WqContactSearch';

@withRouter
export default class WqContact extends Component {
  static propTypes = {
    portal: PropTypes.object,
    url: PropTypes.string,
    params: PropTypes.object, // 3门店,2经销商,不传都显示
    multiple: PropTypes.bool, // 是否需要多选
    selectedIds: PropTypes.string, // 传入选中的id集合
    syncData: PropTypes.func, // 'error', args
  };
  static defaultProps = {
    url: '/sysapp/org/employee/emp_getH5Employee.action'
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      page: 1,
      rows: 50,
      hasMore: -2,
      list: [],
      keywords: '',
      $overflowContainer: null, // 用于indexbar的滚动区域
      selectedMap: {}, // 选中值
      showSearch: false
    };
  }
  componentDidMount = () => {
    this.setState({
      $overflowContainer: this.$elDrag ? this.$elDrag.$el : null
    })
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
  loadData = (isNext) => {
    this.setState(
      (state) => ({
        page: isNext ? state.page + 1 : 1,
        hasMore: -2,
        isLoading: true
      }),
      () => {
        const {params} = this.props;
        const data =  {
          page: this.state.page,
          rows: this.state.rows,
          'query.keywords': this.state.keywords
        };
        this.requestData(params || Object.params(data))
      }
    );
  }
  requestData = (params) => {
    ApiAxios.post(this.props.url, {
      data: params,
      head: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(result => {
      if (result.code === '1') {
        // 设置数据
        const serList = result.data;
        const list = this.state.page === 1 ? serList : this.state.list.concat(serList);
        // 判断0.无更多数据, 1.头部刷新完成, 2.底部刷新完成, 404.一条数据都没有
        let hasMore = this.state.page === 1 ? 1 : 2;
        // 判断是否无更多数据
        if (this.state.rows > serList.length) hasMore = 0;
        // 判断是否暂无数据
        if (list.length === 0) hasMore = 404;
        this.setState({
          list: list,
          isLoading: false,
          hasMore: hasMore
        }, () => {
          this.defaultSelectedMap();
        });
      } else {
        this.setState({
          isLoading: false,
          hasMore: -1
        });
        Bridge.showToast('请求人员列表异常, 请稍后重试', {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('请求人员列表异常, 请稍后重试', {mask: false});
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
  // 去搜索
  goSearch = () => {
    this.setState({
      showSearch: true
    });
  }
  onHideSearch = () => {
    this.setState({
      showSearch: false
    });
  }
  render() {
    const {isLoading, list, selectedMap} = this.state;
    const indexs = []; // 显示分栏
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="选择人员" rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
          <div className="flex flex-middle flex-1 border-b" style={{padding: '0 12px', backgroundColor: '#e8e9eb', height: '40px'}} onClick={this.goSearch}>
            <div className="flex flex-1 flex-middle flex-center bg-white bordered" style={{height: '26px', borderRadius: '6px'}}>
              <i className="icon icon-search size16 color-placeholder"></i>
              <p className="color-placeholder" style={{marginLeft: '6px'}}>按名称或者拼音查询</p>
            </div>
          </div>
        </Header>
        {/* style={{top: '84px'}}  */}
        <Dragrefresh ref={(el) => {this.$elDrag = el;}} className="bg-white" hasMore={this.state.hasMore} onTopRefresh={this.onTopRefresh} onBottomRefresh={this.onBottomRefresh} noDataCaption="暂无数据">
          {list && list.length > 0 && list.map((item, index) => {
            let spellBar = null;
            if (indexs.indexOf(item.name_spell) === -1) {
              indexs.push(item.name_spell);
              spellBar = <p key={`spell${index}`} data-indexbar-name={item.name_spell} style={{backgroundColor: '#ebebeb', padding: '6px 12px', color: '#8e8e8e'}} className="font-size-sm">{item.name_spell}</p>;
            }
            return [
              spellBar,
              <List
                licon={<Checkbox readOnly checked={!!selectedMap[item.id]}/>}
                key={`item${index}`}
                args={item}
                onClick={this.onClickAdd}
                className="flex-middle border-b"
                showAvatar
                avatar={item.face_pic}
                avatarStyle={{marginLeft: '6px'}}
                caption={item.name}
                sndcaption={item.dept_name}
                sndcaptionClassName="font-size-sm"
              />
            ]
          })}
        </Dragrefresh>
        <IndexBar overflowContainer={this.state.$overflowContainer} style={{top: '84px'}}/>
        {isLoading && <Loading style={{top: '44px'}}/>}
        {this.state.showSearch && <WqContactSearch
          portal={this.props.portal}
          url={this.props.url}
          params={this.props.params}
          multiple={this.props.params}
          selectedIds={this.props.selectedIds}
          syncData={this.props.syncData}
          onCancel={this.onHideSearch}
        />}
      </Page>,
      this.props.portal || document.getElementById('root')
    );
  }
}
