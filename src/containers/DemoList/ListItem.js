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
        // return <List key={index} style={{padding: '10px 12px 10px 0', marginLeft: '12px'}} className="flex flex-middle border-b" riconClassName="shape-arrow-right sm" showAvatar 
        //   avatarSrc={item.user_avatar || ''}
        //   caption={item.user_name}
        //   sndcaption={item.dept_name}
        //   args={item}
        //   onClick={this.onClick}
        // />;
        return <List
          key={index}
          showThumbnail
          thumbnailSrc={item.picture ? DB.getStore('app_imgDomain') + item.picture : ''}
          caption={item.name + ' ' + item.name_spec}
          sndcaption={[<span className="font-size-sm color-primary" key={`span`}>返</span>,<Price key={`price`} digits={false} showThousandth={false} price={item.price} unit={'/' + item.unit_name}/>]}
          rcaption={item.input_unit_name}
          rcaptionStyle={{bottom: '10px', right: '12px'}}
          captionClassName="nowrap2" captionStyle={{maxHeight: '40px'}}
          containerStyle={{height: '87px'}}
          thumbnailStyle={{width: '85px', height: '85px'}}
          className="border-b"
        />
      })}
    </Group>;
  }
}
