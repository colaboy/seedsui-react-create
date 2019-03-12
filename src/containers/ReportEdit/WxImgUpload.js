import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgUploader from 'seedsui-react/lib/ImgUploader';

export default class WxImgUpload extends Component {
  static propTypes = {
    max: PropTypes.number,
    tenantId: PropTypes.string,
    onChange: PropTypes.func,
    onChangeSourceType: PropTypes.func,
    watermark: PropTypes.object
  };
  static defaultProps = {
  };
  /* watermark = {
    submitName: '', // 签收评价提交人
    cmLocation: '', // 经纬度
    customerName: '', // 客户名称
    orderNo: '', // 单据编号
    address: '', // 地址
    distance: '' // 偏差
  } */
  constructor(props) {
    super(props);
    this.state = {
      photoList: []
    }
  }
  getUploadDir = (dir, params) => {
    var path = dir || 'test/test01' // 定义的目录
    var month = new Date().format('yyyyMM') // 增加月份目录
    if (params) {
      if (params.customPath) return dir
    }
    return `${path + '/' + month}/`;
  }
  onChange = (list) => {
    this.setState({
      photoList: list
    });
    const {watermark} = this.props;
    const wxPhotos = [];
    let sourceType = 'camera';
    for (var item of list) {
      if (item.sourceType === 'album') sourceType = 'album';
      // 水印信息
      let newWatermark = null;
      if (watermark) {
        newWatermark = [
          watermark.orderNo, // 单据编号
          watermark.customerName, // 客户名称
          watermark.submitName + '  ' + new Date().format('YYYY-MM-DD hh:mm') || ''
        ];
        if (watermark.address) {
          newWatermark.push(watermark.address);
        }
        if (watermark.distance) {
          newWatermark.push(watermark.distance);
        }
      }
      // 上传路径
      var path = this.getUploadDir(this.props.tenantId + '/dh365/std_order') + item.serverId + '.jpg';
      // 上传图片的参数
      wxPhotos.push({
        width: '960',
        serverId: item.serverId,
        path: path,
        watermark: newWatermark
      });
    }
    if (this.props.onChange) this.props.onChange(wxPhotos);
    if (this.props.onChangeSourceType) this.props.onChangeSourceType(sourceType);
  }
  render() {
    const {max} = this.props;
    return (
      <ImgUploader list={this.state.photoList} onChange={this.onChange} caption="图片上传" max={max} showUpload showDelete showCount className="between" style={{margin: '0 12px'}}/>
    );
  }
}
