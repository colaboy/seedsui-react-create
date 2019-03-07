import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Group from 'seedsui-react/lib/Group';
import Checkbox from 'seedsui-react/lib/Checkbox';
import List from 'seedsui-react/lib/List';
import Dragrefresh from 'seedsui-react/lib/Dragrefresh';
import SearchBar from 'components/SearchBar';

export default class ListItem extends Component {
  static propTypes = {
    multiple: PropTypes.bool, // 是否需要多选
    checkbox: PropTypes.bool, // 是否可选
    selectedMap: PropTypes.object, // {id: item, id: item}
    onChecked: PropTypes.func,
    // 分页
    hasMore: PropTypes.number,
    loadData: PropTypes.func,
    list: PropTypes.array, // [{id: '', name: '', code: '', addr: ''}]
    // 过滤条件
    changeFilter: PropTypes.func
  }
  static defaultProps = {
    multiple: true,
    list: []
  }
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    this.props.loadData(false);
  }
  onTopRefresh = () => {
    console.log('头部刷新');
    this.props.loadData(false);
  }
  onBottomRefresh = () => {
    console.log('底部刷新');
    this.props.loadData(true);
  }
  onSearch = (cond) => {
    this.props.changeFilter({
      queryStr: cond
    });
    setTimeout(() => {
      this.props.loadData(false);
    }, 100);
  }
  render() {
    const {selectedMap, list, hasMore, onChecked} = this.props;
    return (
      <Page>
        <Header>
          <div className="flex flex-middle border-b" style={{padding: '0 12px', height: '44px', backgroundColor: 'white'}}>
            <SearchBar placeholder={'输入编码、名称搜索'} onSubmit={this.onSearch}/>
          </div>
        </Header>
        <Dragrefresh hasMore={hasMore} onTopRefresh={this.onTopRefresh} onBottomRefresh={this.onBottomRefresh}>
          <Group>
          {list.length > 0 && list.map((item, index) => {
            return <List
              key={index}
              args={item}
              className="list-li-oneline border-b"
              sndcaptionClassName="font-size-sm"
              containerStyle={{marginLeft: '8px'}}
              licon={<Checkbox args={item.id} checked={!!selectedMap[item.id]}/>}
              caption={item.name}
              sndcaption={item.addr}
              containerAfter={
                <p className="color-sub font-size-sm" style={{marginTop: '6px'}}>{item.code}</p>
              }
              onClick={onChecked}
            />
          })}
          </Group>
        </Dragrefresh>
      </Page>
    );
  }
}
