import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgUploader from '../../lib/ImgUploader';

const Required = {
  position: 'absolute',
  left: '-10px',
  top: '4px',
  height: '10px'
};

export default class WqImgUpload extends Component {
  static propTypes = {
    args: PropTypes.any,
    required: PropTypes.bool,
    caption: PropTypes.node,
    list: PropTypes.array,
    sourceType: PropTypes.array,
    sizeType: PropTypes.oneOfType([ // 压缩['original', 'compressed']
      PropTypes.array,
      PropTypes.string,
      PropTypes.number
    ]),
    max: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func,
    watermark: PropTypes.object,
  };
  static defaultProps = {
    caption: '现场拍照',
    list: [],
    max: 5
  }
  /* watermark = {
    caption: '', // 标题
    customerName: '', // 客户名称
    submitName: '', // 提交人
    distanceLocation: '' // 门店经纬度
    aiCheck: ''
  } */
  constructor(props) {
    super(props);
  }
  onChooseSuccess = (list) => {
    if (this.props.onChange) this.props.onChange(this.props.list.concat(list), this.props.args);
  }
  onDeleteSuccess = (list) => {
    if (this.props.onChange) this.props.onChange(list, this.props.args);
  }
  render() {
    const {
      args,
      required, caption,
      list, sourceType, sizeType, max, onChange, watermark,
      ...others
    } = this.props;
    // 设置水印
    const wqWatermark = watermark ? {
      photoType: watermark.caption || '',
      customerName: watermark.customerName || '',
      cmLocation: watermark.distanceLocation || '',
      submitName: watermark.submitName || '',
      isAiPicCheck: watermark.isAiPicCheck || ''
    } : null;
    return (
      <ImgUploader
        list={list}
        max={max}
        chooseOptions={wqWatermark}
        onChooseSuccess={this.onChooseSuccess}
        onDeleteSuccess={this.onDeleteSuccess}
        caption={required ? <span><span className="color-badge" style={Required}>*</span><span>{caption}</span></span> : <span>{caption}</span>}
        showUpload
        showDelete
        showCount
        className="between border-b"
        style={{margin: '0 12px 0 16px'}}
        captionStyle={{margin: '10px 12px 0 16px'}}
        sourceType={sourceType}
        sizeType={sizeType}
        {...others}
      />
    );
  }
}

/* 用法
// 外勤图片处理
onWqPhotoChange = (list) => {
  console.log(list);
  this.props.setPicList(list)
}
getWqPicPath = (picList) => { // 设置保存服务器路径
  var paths = picList.map(item => {
    // 编辑页面: 已有照片,只需要返回name就可以了
    if (item.upload) return item.name
    // 新增的照片则需要自己拼
    return LocalBridge.getDir('cuxiao', 'month') + '/' + item.name
  });
  return paths.join(',');
}
uploadWqPhoto = () => {
  var dir = LocalBridge.getDir('cuxiao', 'month');
  var localIds = [];
  var tenantId = '';
  // 所有图片
  var photos = this.props.detail.picList.filter((photo) => {
    if (photo.upload) return false;
    return true;
  });
  if (!photos.length) return;
  // 所有localIds
  localIds = photos.map(item => {
    return item.src
  });
  // 离线上传
  if (localIds.length > 0) {
    Bridge.uploadImage({
      dir,
      localIds,
      tenantId
    });
  }
}
<WqImgUpload key={`pic${index}`} args={item} list={item.currentValue} max={item.max_num} sizeType={item.photowd} sourceType={item.is_realtime === '1' ? ['camera'] : ['album', 'camera']} onChange={this.onWqPhotoChange} watermark={{caption: '促销执行', customerName: detail.cm_name, aiCheck: item['allow-copy-check']}}/>
*/