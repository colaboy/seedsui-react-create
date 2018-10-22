import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Group from 'seedsui-react/lib/Group';
import List from 'seedsui-react/lib/List';

export default class ListItem extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    list: PropTypes.array
  };
  static defaultProps = {
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount = () => {
  }
  onClick = (item) => {
    if (this.props.onClick) this.props.onClick(item);
  }
  render() {
    const {list} = this.props;
    return <Group style={{marginTop: '0'}}>
      {list.map((item, index) => {
        return <List key={index} style={{padding: '10px 12px 10px 0', marginLeft: '12px'}} className="flex flex-middle border-b" riconClassName="shape-arrow-right sm" showAvatar 
          avatarSrc={item.user_avatar || ''}
          caption={item.user_name}
          sndcaption={item.dept_name}
          args={item}
          onClick={this.onClick}
        />;
      })}
    </Group>;
  }
}
