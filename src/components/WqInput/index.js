import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputText from 'seedsui-react/lib/InputText';
import Bridge from 'seedsui-react/lib/Bridge';
import WqCustomerType from './WqCustomerType';
import WqCustomer from './WqCustomer';
import WqStore from './WqStore';

export default class WqInput extends Component {
  static propTypes = {
    valueBindProp: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    valueForKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    chooseType: PropTypes.string, // getCustomer|getCustomerMore|getCustomerType|getCustomerArea|getCustomerAreaMore|getDepartment|getDepartmentMore|getContact|getContactMore|getGoods
    chooseParams: PropTypes.object,
    // 【getCustomer与getCustomerMore 的 chooseParams】:
    // tradeType: PropTypes.string, // 1客户 2经销商 3门店,默认1
    // hiddenAdd: PropTypes.bool, // 是否显示添加按钮, 默认false
    // dms_type: PropTypes.string, // dms类型

    // 【getCustomerType】

    // 【getCustomerArea与getCustomerAreaMore】:

    // 【getDepartment与getDepartmentMore】:

    // 【getContact与getContactMore 的 chooseParams】:
    // aclType: PropTypes.string, // 0只能看到下属 不传或者其他的参数为全部人员,默认为空

    // 【getGoods】

    // 【getLocationMap 的 chooseParams】:
    // editable: PropTypes.string, // 是否可以标记位置, 1可标记
    // latlng: PropTypes.string // 经纬度, 只在editable为0时生效
    // title: PropTypes.string // 标题, 可不传
    onClick: PropTypes.func,
    onChange: PropTypes.func
  }
  static defaultProps = {
    chooseType: 'getCustomerType',
    chooseParams: {}
  }
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
  }
  componentDidMount () {
    this.$input = this.refs.$ComponentInputText.$input;
  }
  // 客户类型
  onCustomerTypeChange = (error, selected) => {
    if (error) {
      Bridge.showToast(error, {mask: false});
      return;
    }
    var options = Object.values(selected);
    if (options && options[0]) {
      if (this.props.onChange) this.props.onChange(options[0].name, options[0]);
    } else {
      if (this.props.onChange) this.props.onChange('', {});
    }
    setTimeout(() => {
      this.onHide();
    }, 100);
  }
  onCustomerTypeMoreChange = (error, selected) => {
    if (error) {
      Bridge.showToast(error, {mask: false});
      return;
    }
    var options = Object.values(selected);
    if (options && options[0]) {
      if (this.props.onChange) this.props.onChange(options.map((opt) => {return opt.name}).join(','), options);
    } else {
      if (this.props.onChange) this.props.onChange('', {});
    }
    setTimeout(() => {
      this.onHide();
    }, 100);
  }
  // 客户门店经销商
  onCustomerChange = (error, selected) => {
    if (error) {
      Bridge.showToast(error, {mask: false});
      return;
    }
    var options = Object.values(selected);
    if (options && options[0]) {
      if (this.props.onChange) this.props.onChange(options[0].name, options[0]);
    } else {
      if (this.props.onChange) this.props.onChange('', {});
    }
    setTimeout(() => {
      this.onHide();
    }, 100);
  }
  onCustomerMoreChange = (error, selected) => {
    if (error) {
      Bridge.showToast(error, {mask: false});
      return;
    }
    var options = Object.values(selected);
    if (options && options[0]) {
      if (this.props.onChange) this.props.onChange(options.map((opt) => {return opt.name}).join(','), options);
    } else {
      if (this.props.onChange) this.props.onChange('', {});
    }
    setTimeout(() => {
      this.onHide();
    }, 100);
  }
  // 仓库选择
  onStoreChange = (error, selected) => {
    if (error) {
      Bridge.showToast(error, {mask: false});
      return;
    }
    var options = Object.values(selected);
    if (options && options[0]) {
      if (this.props.onChange) this.props.onChange(options[0].name, options[0]);
    } else {
      if (this.props.onChange) this.props.onChange('', {});
    }
    setTimeout(() => {
      this.onHide();
    }, 100);
  }
  onStoreMoreChange = (error, selected) => {
    if (error) {
      Bridge.showToast(error, {mask: false});
      return;
    }
    var options = Object.values(selected);
    if (options && options[0]) {
      if (this.props.onChange) this.props.onChange(options.map((opt) => {return opt.name}).join(','), options);
    } else {
      if (this.props.onChange) this.props.onChange('', {});
    }
    setTimeout(() => {
      this.onHide();
    }, 100);
  }
  // 选择控件的显示与隐藏
  onShow = () => {
    this.setState({
      show: true
    });
  }
  onHide = () => {
    this.setState({
      show: false
    });
  }
  // 构建需要的选中值, 把'id,id'和'name,name'合并成{id: {id: 'id', name: 'name}}
  buildSelectedMap = (idsStr, namesStr) => {
    if (!idsStr || !namesStr) return {};
    const names = namesStr.split(',');
    const selectedMap = {};
    idsStr.split(',').forEach((id, index) => {
      selectedMap[id] = {
        id: id,
        name: names[index] || ''
      }
    });
    return selectedMap;
  }
  render() {
    const {
      chooseType, chooseParams, // 为others不多属性
      value, valueForKey, onChange, onClick, ...others
    } = this.props;
    const {show} = this.state;
    if (!show || !chooseType) {
      return <InputText ref="$ComponentInputText" value={value} {...others} readOnly onClick={this.onShow}/>
    } else if (chooseType === 'getCustomerType') {
      return <WqCustomerType multiple={false} selectedIds={valueForKey} params={chooseParams} onSubmit={this.onCustomerTypeChange} onHide={this.onHide}/>
    } else if (chooseType === 'getCustomerTypeMore') {
      return <WqCustomerType multiple selectedIds={valueForKey} params={chooseParams} onSubmit={this.onCustomerTypeMoreChange} onHide={this.onHide}/>
    } else if (chooseType === 'getCustomer') {
      return <WqCustomer multiple={false} selectedMap={this.buildSelectedMap(valueForKey, value)} params={chooseParams} onSubmit={this.onCustomerChange} onHide={this.onHide}/>
    } else if (chooseType === 'getCustomerMore') {
      return <WqCustomer multiple selectedMap={this.buildSelectedMap(valueForKey, value)} params={chooseParams} onSubmit={this.onCustomerMoreChange} onHide={this.onHide}/>
    } else if (chooseType === 'getStore') {
      return <WqStore multiple={false} selectedMap={this.buildSelectedMap(valueForKey, value)} params={chooseParams} onSubmit={this.onStoreChange} onHide={this.onHide}/>
    } else if (chooseType === 'getStoreMore') {
      return <WqStore multiple selectedMap={this.buildSelectedMap(valueForKey, value)} params={chooseParams} onSubmit={this.onStoreMoreChange} onHide={this.onHide}/>
    }
    return null;
  }
}
