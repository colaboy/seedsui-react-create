import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Group from 'seedsui-react/lib/Group';
import List from 'seedsui-react/lib/List';
import Mark from 'seedsui-react/lib/Mark';

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
        let mark = '';
        // 0.未审批 1.初审通过 2.初审打回 3.终审通过 4.终审打回
        switch (item.businessApproveStatus) {
          case '0':
            mark = <Mark className="warn">未审批</Mark>;
            break;
          case '1':
            mark = <Mark className="success">初审通过</Mark>;
            break;
          case '2':
            mark = <Mark className="cancel">初审打回</Mark>;
            break;
          case '3':
            mark = <Mark className="success">终审通过</Mark>;
            break;
          case '4':
            mark = <Mark className="cancel">终审打回</Mark>;
            break;
          default:
            mark = '';
        }
        return <List key={index} style={{padding: '10px 12px 10px 0', marginLeft: '12px'}} className="flex flex-middle border-b"
          caption={item.cmName}
          sndcaption={item.linkManName + ' ' + item.linkManMobile}
          containerAfter={
            <div className="flex flex-middle" style={{marginTop: '6px'}}>
              <p className="flex-1 color-sub">{item.firstApproveTime}</p>
              <p className="color-primary">¥{item.amount}</p>
            </div>
          }
          rcaption={mark}
          rcaptionStyle={{right: '12px'}}
          args={item}
          onClick={this.onClick}
        />;
      })}
    </Group>;
  }
}
