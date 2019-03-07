import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'seedsui-react/lib/Button';
import Bridge from 'seedsui-react/lib/Bridge';
import MediaUtil from 'seedsui-react/lib/MediaUtil';

export default class WqVideoRecord extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.object,
    id: PropTypes.string, // 宴会id
    vid: PropTypes.string, // 编辑,上传视频的id,如果存在说明已上传
    vidtime: PropTypes.string, // 编辑,与vid相依存,对应上传视频时长
    onChange: PropTypes.func
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props);
    Bridge.debug = true
    this.state = {
      recordStatus: props.vid ? '2' : '0',
      recordTime: props.vidtime || '',
    }
  }
  componentDidMount = () => {
    // if (this.props.id) this.videoInfo();
  }
  /* -----------------------------------------------------
    视频录制
    @params {id: '宴会id'}
    @return {result: '1', ID: '宴会id', secs: '毫秒'}
  ----------------------------------------------------- */
  videoRecord = () => {
    Bridge.videoRecord({
      id: this.props.id,
      onSuccess: (res) => {
        Bridge.showToast('录制完成,请上传', {mask: false});
        this.setState({
          recordStatus: '1',
          recordTime: MediaUtil.convertTime(res.secs)
        });
        if (this.props.onChange) this.props.onChange(Object.assign({status: '1'}, res))
      }
    });
  }
  /* -----------------------------------------------------
    视频上传
    @params {id: '宴会id'}
    @return {result: '1', ID: '宴会id', secs: '毫秒', vid: ''}
  ----------------------------------------------------- */
  videoUpload = () => {
    Bridge.videoUpload({
      id: this.props.id,
      onSuccess: (res) => {
        Bridge.showToast('上传成功', {mask: false});
        this.setState({
          recordStatus: '2'
        });
        if (this.props.onChange) this.props.onChange(Object.assign({status: '2'}, res))
      },
      onFail: () => {
        Bridge.showToast('上传失败', {mask: false});
      }
    });
  }
  /* -----------------------------------------------------
    视频是否已经录制过了
    @params {id: '宴会id'}
    @return {result: '1', ID: '宴会id', secs: '毫秒', vid: '仅在hasUpload=1的情况下返回', hasVideo: '0|1', hasUpload: '0|1}
  ----------------------------------------------------- */
  videoInfo = () => {
    Bridge.videoInfo({
      id: this.props.id,
      onSuccess: (res) => {
        if (res.hasUpload === '1') { // 已上传
          this.setState({
            recordStatus: '2',
            recordTime: MediaUtil.convertTime(res.secs)
          });
          if (this.props.onChange) this.props.onChange(Object.assign({status: '2'}, res))
        } else if (res.hasVideo === '1') { // 未上传
          this.setState({
            recordStatus: '1',
            recordTime: MediaUtil.convertTime(res.secs)
          });
          if (this.props.onChange) this.props.onChange(Object.assign({status: '1'}, res))
        }
      },
      onFail: () => {
        Bridge.showToast('未查到此视频信息', {mask: false});
      }
    });
  }
  render() {
    const {style, className} = this.props;
    const {recordStatus, recordTime} = this.state;
    if (recordStatus === '1') {
      return (
        <div className={`flex flex-middle${className ? ' ' + className : ''}`} style={Object.assign({margin: '10px 12px'}, style)}>
          <Button className="primary outline" style={{height: '26px', borderRadius: '32px', padding: '0 8px'}} onClick={this.videoRecord}>录制现场</Button>
          <p className="flex-1 color-sub font-size-sm" style={{margin: '0 12px'}}>视频时长: {recordTime}</p>
          <Button className="primary outline" style={{height: '26px', borderRadius: '32px', padding: '0 12px'}} onClick={this.videoUpload}>上传</Button>
        </div>
      );
    } else if (recordStatus === '2'){
      return (
        <div className={`flex flex-middle${className ? ' ' + className : ''}`} style={Object.assign({margin: '10px 12px'}, style)}>
          <Button className="primary outline" style={{height: '26px', borderRadius: '32px', padding: '0 8px'}} onClick={this.videoRecord}>录制现场</Button>
          <p className="flex-1 color-sub font-size-sm" style={{margin: '0 12px'}}>视频时长: {recordTime}</p>
          <p className="color-success">已上传</p>
        </div>
      );
    }
    return (
      <div className={`flex flex-middle${className ? ' ' + className : ''}`} style={Object.assign({margin: '10px 12px'}, style)}>
        <Button className="primary outline" style={{height: '26px', borderRadius: '32px', padding: '0 8px'}} onClick={this.videoRecord}>录制现场</Button>
      </div>
    );
  }
}
/* 用法
// 视频上传
onRecordVideo = (res) => {
  if (res.status === '2') {
    this.onChange(res.vid, 'vid');
  }
}
{detail.banquet_id && <WqVideoRecord id={'report' + detail.banquet_id} vid={detail.vid} vidtime={detail.time} style={{margin: '10px 12px 10px 16px'}} onChange={this.onRecordVideo}/>}
*/