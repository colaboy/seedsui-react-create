import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgUploader from 'seedsui-react/lib/ImgUploader';
import Bridge from 'seedsui-react/lib/Bridge';

const Required = {
  position: 'absolute',
  left: '-10px',
  top: '4px',
  height: '10px'
};

const watermarkInfo = {
  caption: '',
  customerName: '',
  submitName: '',
  time: '',
  address: '',
  distance: ''
};
let watermark = {};

export default class WxImgUpload extends Component {
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
    watermark: PropTypes.object
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
    distanceLocation: '' // 计算比较的偏差位置
  } */
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    Bridge.debug = true;
    if (this.props.watermark && !Object.isEmptyObject(this.props.watermark)) {
      this.watermarkInit();
    }
  }
  onChooseSuccess = (currentList) => {
    if (this.props.onChange) this.props.onChange(this.props.list.concat(currentList), this.props.args);
  }
  onUploadsSuccess = (currentList) => {
    // 过滤原有list中和现在list中相同的图片
    var prevList = this.props.list.filter((item) => {
      for (let current of currentList) {
        if (current.id === item.id) return false;
      }
      return true;
    });
    // 原图和现图拼合
    var list = currentList.concat(prevList);
    list = this.watermarkList(list);
    if (this.props.onChange) this.props.onChange(list, this.props.args);
  }
  onUploadFail = (currentList, delItem) => { // delItem: {index: number, item: {serverId: '', sourceType: ''}, code: 'uploadFail', msg: string}
    const list = this.props.list.filter((photo) => {
      if (photo.id === delItem.item.serverId) return false
      return true
    });
    if (this.props.onChange) this.props.onChange(list, this.props.args);
  }
  onDeleteSuccess = (list) => {
    if (this.props.onChange) this.props.onChange(list, this.props.args);
  }
  /* --------------------
    微信水印处理
  ----------------------*/
  watermarkInit = () => {
    watermarkInfo.caption = this.props.watermark.caption;
    watermarkInfo.customerName = this.props.watermark.customerName;
    watermarkInfo.submitName = this.props.watermark.submitName;
    watermarkInfo.time = new Date().format('yyyy-MM-dd hh:mm');
    // 设置address与distance
    this.watermarkLocation(() => {
      watermark = {};
      if (watermarkInfo.caption) watermark['1'] = watermarkInfo.caption
      if (watermarkInfo.customerName) watermark['2'] = watermarkInfo.customerName
      if (watermarkInfo.submitName) {
        watermark['3'] = watermarkInfo.submitName + ' ' + watermarkInfo.time
      } else {
        watermark['3'] = watermarkInfo.time
      }
      if (watermarkInfo.address) watermark['4'] = watermarkInfo.address
      if (watermarkInfo.distance) watermark['5'] = watermarkInfo.distance
    });
  }
  watermarkLocation = (success) => {
    const {distanceLocation} = this.props.watermark;
    // loading
    Bridge.showLoading();
    // 获取位置
    Bridge.getLocation({
      onSuccess: (data) => {
        // 设置偏差
        if (distanceLocation) {
          let point = distanceLocation.split(',');
          var distance = Bridge.getDistance({
            point1: {
              longitude: point[1],
              latitude: point[0]
            },
            point2: {
              longitude: data.longitude,
              latitude: data.latitude
            },
            onError: (err) => {
              Bridge.showToast(err.msg, {mask: false});
            }
          });
          if (distance) distance = '偏差' + (distance * 1000) + '米';
          watermarkInfo.distance = distance;
        }
        // 客户端自带地址
        if (data.address) {
          Bridge.hideLoading();
          // 设置地址
          var address = data.address;
          watermarkInfo.address = address;
          if (success) success();
          return;
        }
        // 地址逆解析
        if (data.longitude && data.latitude) {
          Bridge.getAddress({
            latitude: data.latitude,
            longitude: data.longitude,
            type: 'gcj02',
            onSuccess: (addrs) => {
              Bridge.hideLoading();
              // 设置地址
              var address = addrs.address;
              watermarkInfo.address = address;
              if (success) success();
            },
            onError: () => {
              Bridge.hideLoading();
              Bridge.showToast('获取位置名称失败,请稍后重试', {mask: false});
              if (success) success();
            }
          });
        }
      },
      onError: (err) => {
        Bridge.hideLoading();
        if (success) success();
      }
    });
  }
  watermarkList = (list) => {
    if (this.props.watermark && !Object.isEmptyObject(this.props.watermark)) {
      return list.map((item) => {
        item.watermark = Object.values(watermark);
        return item;
      })
    } else {
      return list
    }
  }
  render() {
    const {
      args,
      required, caption,
      list, sourceType, sizeType, max, onChange, watermark,
      ...others
    } = this.props;
    return (
      <ImgUploader
        list={list}
        max={max}
        onChooseSuccess={this.onChooseSuccess}
        onUploadsSuccess={this.onUploadsSuccess}
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
// 微信图片处理
onWxPhotoChange = (list) => {
  this.props.setPicList(list)
}
getWxPics = (picList) => { // 设置保存服务器路径
  const {detail} = this.props;
  var pics = picList.map(item => {
    // 编辑页面: 已有照片,只需要返回name就可以了
    if (item.upload) return {
      value: item.name
    }
    // 新增的照片则需要自己拼
    return {
      value: detail.upload_dir + '/' + item.serverId + '.jpg',
      serverId: item.serverId,
      watermark: item.watermark
    }
  });
  return pics;
}
*/