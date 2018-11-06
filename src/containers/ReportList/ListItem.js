import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import List from 'seedsui-react/lib/List';
import Card from 'seedsui-react/lib/Card';
import Mark from 'seedsui-react/lib/Mark';
import Attributes from 'seedsui-react/lib/Attributes';

const TitleStyle = {
  borderBottom: '1px dashed #d1d1d1'
}
export default
@withRouter
class ListItem extends Component {
  static propTypes = {
    list: PropTypes.array
  };
  static defaultProps = {
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount = () => {
  }
  goDetail = (item) => {
    this.props.history.push(`/reportDetail/${item.id}`);
  }
  goExecDetail = () => {
    console.log('执行详情');
  }
  goCheckResult = () => {
    console.log('审核结果');
  }
  render() {
    const {list} = this.props;
    return <div>
      {list.map((item, index) => {
        let attrs = [
          {
            name: '单据编号',
            value: item.code
          },
          {
            name: '宴会类型',
            value: item.banquet_list_type
          },
          {
            name: '终端名称',
            value: item.store_name
          },
          {
            name: '宴会用酒',
            value: item.product_name
          },
          {
            name: '申报时间:',
            value: item.create_time_str + ' ' + item.creator_name
          }
        ];
        let mark = null;
        switch (item.approval_status) {
          case '0':
            mark = <Mark className="warn">待审核</Mark>;
            break;
          case '1':
            mark = <Mark className="success">已通过</Mark>;
            break;
          case '2':
            mark = <Mark className="cancel">未通过</Mark>;
            break;
          case '3':
            mark = <Mark className="disabled">已取消</Mark>;
            break;
          case '4':
            mark = <Mark className="info">物流码校验中</Mark>;
            break;
          case '5':
            mark = <Mark className="cancel">物流码报错</Mark>;
            break;
          default:
            mark = null;
        }
        return <Card key={index} args={item} onClick={this.goDetail}>
          <List className="list-li-oneline" caption={item.banquet_list_name} style={TitleStyle} rcaption={mark}/>
          <Attributes list={attrs} valueStyle={{marginLeft: '8px'}}/>
          <hr/>
          <List args={item} caption={`执行时间: ${item.exe_time_str}`} riconClassName="shape-arrow-right sm" style={{margin: '10px 12px', padding: '0'}} onClick={this.goExecDetail}/>
          {item.approval_status === '1' && <List caption="跟单审核结果" riconClassName="shape-arrow-right sm" style={{margin: '10px 12px', padding: '0'}} onClick={this.goCheckResult}/>}
        </Card>
      })}
    </div>;
  }
}
