import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Group from 'seedsui-react/lib/Group';
import Checkbox from 'seedsui-react/lib/Checkbox';
import List from 'seedsui-react/lib/List';

export default class ListItem extends Component {
  static propTypes = {
    multiple: PropTypes.bool, // 是否需要多选
    checkbox: PropTypes.bool, // 是否可选
    selectedMap: PropTypes.object, // {id: item, id: item}
    onChecked: PropTypes.func,
    // 数据
    list: PropTypes.array, // [{id: '', name: ''}]
  }
  static defaultProps = {
    multiple: true,
    list: []
  }
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
  }
  render() {
    const {selectedMap, list, onChecked} = this.props;
    return (
      <Group>
        {list.length > 0 && list.map((item, index) => {
          return <List
            key={index}
            args={item}
            className="list-li-oneline border-b"
            containerStyle={{marginLeft: '8px'}}
            licon={<Checkbox args={item.id} checked={!!selectedMap[item.id]}/>}
            caption={item.name}
            onClick={onChecked}
          />
        })}
      </Group>
    );
  }
}
