import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgUploader from 'seedsui-react/lib/ImgUploader';

export default class WqImgUpload extends Component {
  static propTypes = {
    list: PropTypes.array,
    max: PropTypes.number,
    onChange: PropTypes.func,
    watermark: PropTypes.object
  };
  static defaultProps = {
    max: 15
  }
  /* watermark = {
    orderNo: '', // 单据编号
    customerName: '', // 客户名称
    submitName: '', // 签收评价提交人
    cmLocation: '' // 经纬度
  } */
  constructor(props) {
    super(props);
  }
  onChooseSuccess = (list) => {
    if (this.props.onChange) this.props.onChange(this.props.list.concat(list));
  }
  onDeleteSuccess = (list) => {
    if (this.props.onChange) this.props.onChange(list);
  }
  render() {
    const {list, max, watermark} = this.props;
    // 设置水印
    const argWatermark = watermark ? {
      photoType: watermark.orderNo || '',
      customerName: watermark.customerName || '',
      submitName: watermark.submitName || '',
      cmLocation: watermark.cmLocation || ''
    } : null;
    return (
      <ImgUploader list={list} watermark={argWatermark} onChooseSuccess={this.onChooseSuccess} onDeleteSuccess={this.onDeleteSuccess} caption="现场拍照" max={max} showUpload showDelete showCount className="between" style={{margin: '0 12px 0 16px'}} captionStyle={{margin: '10px 12px 0 16px'}} sourceType={['camera']} sizeType={['original']}/>
    );
  }
}
