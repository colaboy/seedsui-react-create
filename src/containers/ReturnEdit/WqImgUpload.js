import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgUploader from 'seedsui-react/lib/ImgUploader';

export default class WqImgUpload extends Component {
  static propTypes = {
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
    this.state = {
      photoList: []
    }
  }
  onChange = (list) => {
    this.setState({
      photoList: list
    });
    const wqPhotos = [];
    for (var item of list) {
      wqPhotos.push({
        name: item.name,
        src: item.src
      });
    }
    if (this.props.onChange) this.props.onChange(wqPhotos);
  }
  render() {
    const {max, watermark} = this.props;
    // 设置水印
    const argWatermark = watermark ? {
      photoType: watermark.orderNo || '',
      customerName: watermark.customerName || '',
      submitName: watermark.submitName || '',
      cmLocation: watermark.cmLocation || ''
    } : null;
    return (
      <ImgUploader list={this.state.photoList} watermark={argWatermark} onChange={this.onChange} caption="现场拍照" max={max} showUpload showDelete showCount className="between" style={{margin: '0 12px 0 16px'}} captionStyle={{margin: '10px 12px 0 16px'}} sourceType={['camera']} sizeType={['original']}/>
    );
  }
}
