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
import InputText from 'seedsui-react/lib/InputText';
import Checkbox from 'seedsui-react/lib/Checkbox';

@withRouter
export default class WqContactSearch extends Component {
  static propTypes = {
    portal: PropTypes.object,
    url: PropTypes.string,
    params: PropTypes.object, // 3门店,2经销商,不传都显示
    multiple: PropTypes.bool, // 是否需要多选
    selectedIds: PropTypes.string, // 传入选中的id集合
    syncData: PropTypes.func, // 'error', args
    onCancel: PropTypes.func
  };
  static defaultProps = {
    url: '/sysapp/org/employee/emp_getH5Employee.action'
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      page: 1,
      rows: 50,
      hasMore: 404,
      list: [],
      keywords: '',
      selectedMap: {} // 选中值
    };
  }
  componentDidMount = () => {
  }
  componentWillUnmount() {
  }
  // 搜索
  onSearch = (value) => {
    this.throttle(this.searchData, null, 500, value)
  }
  searchData = (value) => {
    this.setState({
      keywords: value
    },
    () => {
      this.loadData(false);
    })
  }
  throttle = (fn, context, delay, text) => {
    clearTimeout(fn.timeoutId);
    fn.timeoutId = setTimeout(function(){
        fn.call(context,text);
    },delay);
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
  onCancel = () => {
    if (this.props.onCancel) this.props.onCancel();
  }
  render() {
    const {isLoading, list, selectedMap} = this.state;
    return createPortal(
      <Page style={{zIndex: '2'}}>
        <Header>
          <Titlebar caption="选择人员" rButtons={!isLoading && this.props.multiple ? [{caption: '确定', onClick: this.onSubmit}] : []}/>
          <div className="flex border-b" style={{padding: '6px 12px', backgroundColor: '#e8e9eb'}}>
            <InputText placeholder="按名称或者拼音查询" liconClassName="icon-search size20 color-placeholder" className="bg-white bordered" style={{padding: '0 8px', borderRadius: '6px'}} inputStyle={{padding: '2px 0'}} onChange={this.onSearch}/>
            <div style={{display: 'block', fontSize: '15px', lineHeight: '30px', paddingLeft: '10px'}} onClick={this.onCancel}>取消</div>
          </div>
        </Header>
        {/* style={{top: '84px'}}  */}
        <Dragrefresh ref={(el) => {this.$elDrag = el;}} className="bg-white" hasMore={this.state.hasMore} onTopRefresh={this.onTopRefresh} onBottomRefresh={this.onBottomRefresh} noDataCaption="暂未查询人员">
          {list && list.length > 0 && list.map((item, index) => {
            return <List
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
          })}
        </Dragrefresh>
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>,
      this.props.portal || document.getElementById('root')
    );
  }
}
