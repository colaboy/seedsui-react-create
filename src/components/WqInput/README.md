```javascript
onCustomer = (value, option) => {
  if (!value) {
    Bridge.showToast('没有客户名称', {mask: false});
    return;
  }
  if (!option.id) {
    Bridge.showToast('没有id', {mask: false});
    return;
  }
  if (this.props.customer_id === option.id) {
    return;
  }
  this.props.onChange({
    customer_id: option.id,
    customer_name: value
  });
}

<WqInput
  valueBindProp
  value={customer_name}
  valueForKey={customer_id}
  onChange={this.onCustomer}
  chooseType="getCustomer"
  chooseParams={{tradeType: '1'}}
  style={{padding: '0 12px 0px 0', marginLeft: '16px'}}
  className="border-b"
  placeholder="请选择"
  riconClassName="shape-arrow-right sm"
/>
```