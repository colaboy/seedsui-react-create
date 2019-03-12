import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Container from 'seedsui-react/lib/Container';
import Loading from 'seedsui-react/lib/Loading';
import Bridge from 'seedsui-react/lib/Bridge';
import List from 'seedsui-react/lib/List';
import InputText from 'seedsui-react/lib/InputText';
import InputPhone from 'seedsui-react/lib/InputPhone';
import InputPicker from 'seedsui-react/lib/InputPicker';
import InputDate from 'seedsui-react/lib/InputDate';
import InputCity from 'seedsui-react/lib/InputCity';
import InputNumber from 'seedsui-react/lib/InputNumber';
import InputArea from 'seedsui-react/lib/InputArea';
import Group from 'seedsui-react/lib/Group';
import Grid from 'seedsui-react/lib/Grid';
import Button from 'seedsui-react/lib/Button';
import Icon from 'seedsui-react/lib/Icon';
import InputWaiqin from 'seedsui-react/lib/InputWaiqin';
import {changeDetail, editDetail, reportParams, save} from 'store/modules/reportEdit';
import WqImgUpload from './WqImgUpload';
import WqVideoRecord from './WqVideoRecord';

const Required = {
  position: 'absolute',
  left: '-10px',
  top: '4px',
  height: '10px'
};
const Caption = {
  padding: '12px 12px 0 16px'
}
const InputStyle = {
  marginLeft: '16px',
  paddingRight: '12px'
}

export default
@withRouter
@connect(state => ({
  isLoading: state.reportEdit.isLoading,
  detail: state.reportEdit.detail,
}), {
  changeDetail,
  editDetail,
  reportParams,
  save
})
class ReportEdit extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    detail: PropTypes.object,
    changeDetail: PropTypes.func,
    editDetail: PropTypes.func,
    reportParams: PropTypes.func,
    save: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      wqPhotos: [], // [{src: '', name: ''}]
    }
  }
  componentDidMount() {
    Bridge.debug = true;
    if (this.props.match.params.op === 'edit') {
      this.editDetail();
    } else {
      this.reportParams();
    }
  }
  componentWillUnmount() {
  }
  editDetail = () => {
    this.props.editDetail();
  }
  reportParams = () => {
    this.props.reportParams().then((result) => {
      if (result.code === '1') {
      } else {
        this.reportParamsError();
      }
    }).catch(() => {
      this.reportParamsError();
    });
  }
  reportParamsError = () => {
    Bridge.showConfirm('获取必要参数失败,是否重新获取?', {
      onSuccess: (e) => {
        e.hide();
        this.reportParams();
      },
      onError: (e) => {
        e.hide();
        this.props.history.goBack();
      }
    });
  }
  save = () => {
    // 上传照片
    this.uploadWqPhoto();
    // 保存
    const {detail} = this.props;
    const params = {
      banquet_name: detail.banquet_name,
      banquet_type: detail.banquet_type,
      banquet_date_str: detail.banquet_date_str,
      end_date_str: detail.end_date_str,
      banquet_time: detail.banquet_time,
      mss_msg: detail.mss_msg,
      table_number: detail.table_number,
      banquet_address: detail.banquet_address,
      consumer: detail.consumer,
      consumer_phone: detail.consumer_phone,
      store_id: detail.store_id,
      dealer_id: detail.dealer_id,
      product_id: detail.product_id,
      documentary_mode: detail.documentary_mode,
      merchandiser: detail.merchandiser,
      wine_code: detail.wine_code.join(','),
      vid: detail.vid,
      remark: detail.remark,
      pic_path: detail.pic_path
    }
    console.log(params);
    // this.props.save(params).then((result) => {
    //   if (result.code === '1') {
    //   } else {
    //     Bridge.showToast(result.message, {mask: false});
    //   }
    // }).catch((err) => {
    //   Bridge.showToast('请求异常，请稍后再试', {mask: false});
    // });
  }
  onChange = (value, name) => {
    this.props.changeDetail(name, value);
  }
  onSubmit = () => {
    const {detail} = this.props;
    if (!detail.banquet_name) {
      Bridge.showToast('宴会名称不能为空', {mask: false});
      return;
    }
    if (!detail.banquet_type) {
      Bridge.showToast('宴会类型不能为空', {mask: false});
      return;
    }
    if (!detail.banquet_date_str) {
      Bridge.showToast('宴会开展日期不能为空', {mask: false});
      return;
    }
    if (!detail.end_date_str) {
      Bridge.showToast('宴会结束日期不能为空', {mask: false});
      return;
    }
    if (!detail.banquet_time) {
      Bridge.showToast('宴会开展时间不能为空', {mask: false});
      return;
    }
    if (!detail.mss_msg) {
      Bridge.showToast('宴会开展区域不能为空', {mask: false});
      return;
    }
    if (!detail.table_number) {
      Bridge.showToast('宴会桌数不能为空', {mask: false});
      return;
    }
    if (!detail.banquet_address) {
      Bridge.showToast('宴会地址不能为空', {mask: false});
      return;
    }
    if (!detail.consumer) {
      Bridge.showToast('消费者不能为空', {mask: false});
      return;
    }
    if (!detail.consumer_phone) {
      Bridge.showToast('消费者联系方式不能为空', {mask: false});
      return;
    }
    if (detail.consumer_phone.length !== 11) {
      Bridge.showToast('消费者联系方式输入不正确', {mask: false});
      return;
    }
    if (!detail.store_id) {
      Bridge.showToast('终端不能为空', {mask: false});
      return;
    }
    if (!detail.dealer_id) {
      Bridge.showToast('经销商不能为空', {mask: false});
      return;
    }
    if (!detail.product_id) {
      Bridge.showToast('宴会用酒不能为空', {mask: false});
      return;
    }
    if (!detail.documentary_mode) {
      Bridge.showToast('跟单方式不能为空', {mask: false});
      return;
    }
    if (detail.documentary_mode === '2') {
      if (!detail.merchandiser) {
        Bridge.showToast('跟单人不能为空', {mask: false});
        return;
      }
    }
    if (!detail.wine_code || !detail.wine_code.length) {
      Bridge.showToast('请添加扫码清单', {mask: false});
      return;
    }
    const wineCodeRequired = detail.wine_code.some((code, index) => {
      if (!code) {
        Bridge.showToast(`扫码清单第${index + 1}项不能为空`, {mask: false});
        return true;
      }
      return false;
    });
    if (wineCodeRequired) return;
    if (!detail.vid) {
      Bridge.showToast('请上传录播视频', {mask: false});
      return;
    }
    this.save();
  }
  // 扫码信息-扫码添加
  onBarcode = () => {
    Bridge.scanQRCode({
      onSuccess: (res) => {
        let barcodes = this.props.detail.wine_code || [];
        barcodes.push(res.resultStr);
        this.onChange(barcodes, 'wine_code');
      }
    })
  }
  // 扫码信息-录入添加
  onWritecode = () => {
    let barcodes = this.props.detail.wine_code || [];
    barcodes.push('');
    this.onChange(barcodes, 'wine_code');
  }
  // 扫码信息-修改
  onChangeBarcode = (value, index) => {
    let barcodes = this.props.detail.wine_code || [];
    barcodes[index] = value;
    this.onChange(barcodes, 'wine_code');
  }
  // 扫码信息-删除一行
  onDelBarcode = (value, index) => {
    let barcodes = this.props.detail.wine_code || [];
    barcodes.splice(index, 1);
    this.onChange(barcodes, 'wine_code');
  }
  // 现场拍照
  /* --------------------
    外勤图片处理
  ----------------------*/
  getWqPicPath = () => {
    const {detail} = this.props;
    var paths = detail.pic_path_list.map(item => {
      if (item.upload) return item.src
      return detail.dir + '/' + item.name
    });
    return paths.join(',');
  }
  onWqPhotoChange = (photo) => {
    this.onChange(photo, 'pic_path_list');
    // 设置pic_path提交服务器路径
    const {detail} = this.props;
    setTimeout(() => {
      if (detail.pic_path_list && detail.pic_path_list.length) {
        const pic_path = this.getWqPicPath();
        this.onChange(pic_path, 'pic_path');
      } else {
        this.onChange('', 'pic_path');
      }
    }, 100);
  }
  uploadWqPhoto = () => {
    const {detail} = this.props;
    if (!detail.pic_path_list || !detail.pic_path_list.length) {
      return;
    }
    var localIds = [];
    localIds = detail.pic_path_list.filter(item => {
      return !item.upload
    });
    localIds = detail.pic_path_list.map(item => {
      return item.src
    });
    Bridge.uploadImage({
      dir: detail.dir,
      localIds
    });
  }
  // 视频上传
  onRecordVideo = (res) => {
    if (res.status === '2') {
      this.onChange(res.vid, 'vid');
    }
  }
  render() {
    const {isLoading, detail} = this.props;
    // 最小宴会开展日期
    const today = new Date();
    const minStartDate = (today && detail.limit_days) ? today.nextDate(detail.limit_days).format('YYYY-MM-DD') : null;
    // 操作按钮
    let rBtns = [];
    rBtns = [
      {
        caption: '提交',
        onClick: this.onSubmit,
        style: {color: '#FF9008'}
      }
    ]
    return (
      <Page>
        <Header>
          <Titlebar caption="宴会报备" rButtons={rBtns}/>
        </Header>
        {detail && <Container>
          <Group>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会名称</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputText value={detail.banquet_name} args={'banquet_name'} onChange={this.onChange} className="border-b" clear style={InputStyle} valueBindProp placeholder="请输入"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会类型</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputPicker value={detail.banquet_type_name} valueForKey={detail.banquet_type} onChange={(val, option) => {this.onChange(val, 'banquet_type_name');this.onChange(option.key, 'banquet_type');}} list={detail.banquet_type_list} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会开展日期</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputDate value={detail.banquet_date_str} args={'banquet_date_str'} onChange={(val, option, args) => {this.onChange(val, args)}} min={minStartDate} max={detail.end_date_str} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会结束日期</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputDate value={detail.end_date_str} args={'end_date_str'} onChange={(val, option, args) => {this.onChange(val, args)}} min={detail.banquet_date_str || minStartDate} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会开展时间</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputDate value={detail.banquet_time} args={'banquet_time'} type="time" onChange={(val, option, args) => {this.onChange(val, args)}} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会开展区域</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputCity value={detail.mss_msg} args={'mss_msg'} onChange={(val, option, args) => {this.onChange(val, args)}} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm" split=","/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会桌数</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputNumber value={detail.table_number} args={'table_number'} onChange={this.onChange} className="border-b" clear style={InputStyle} valueBindProp placeholder="请输入"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会地址</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputWaiqin value={detail.banquet_address} onChange={(val) => {this.onChange(val, 'banquet_address')}} chooseType="getLocationMap" className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>消费者</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputText value={detail.consumer} args={'consumer'} onChange={this.onChange} className="border-b" clear style={InputStyle} valueBindProp placeholder="请输入"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>联系方式</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputPhone value={detail.consumer_phone} args={'consumer_phone'} onChange={this.onChange} className="border-b" clear style={InputStyle} valueBindProp placeholder="请输入"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>终端</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputWaiqin value={detail.store_name} valueForKey={detail.store_id} onChange={(value, option) => {this.onChange(value, 'store_name');this.onChange(option.id, 'store_id');}} chooseType="getCustomer" chooseParams={{tradeType: '3'}} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>经销商</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputWaiqin value={detail.dealer_name} valueForKey={detail.dealer_id} onChange={(value, option) => {this.onChange(value, 'dealer_name');this.onChange(option.id, 'dealer_id');}} chooseType="getCustomer" chooseParams={{tradeType: '2'}} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>宴会用酒</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputWaiqin value={detail.product_name} valueForKey={detail.product_id} onChange={(value, option) => {this.onChange(value, 'product_name');this.onChange(option.id, 'product_id');}} chooseType="getGoods" className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>跟单方式</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputPicker value={detail.documentary_mode_name} valueForKey={detail.documentary_mode} onChange={(val, option) => {this.onChange(val, 'documentary_mode_name');this.onChange(option.key, 'documentary_mode');}} list={detail.documentary_mode_list} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            {detail.documentary_mode === '2' && [<List key="documentaryTitle" caption={<div><span className="color-badge" style={Required}>*</span><span>选择帮手</span></div>} className="list-li-oneline color-sub" style={Caption}/>,
            <InputWaiqin key="documentaryContent" value={detail.merchandiser_name} valueForKey={detail.merchandiser} onChange={(value, option) => {this.onChange(value, 'merchandiser_name');this.onChange(option.id, 'merchandiser');}} chooseType="getContact" chooseParams={{aclType: '0'}} className="border-b" style={InputStyle} valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>]}
          </Group>
          {/* 扫码信息 */}
          <Group>
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>扫码信息</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <Grid col="2" wing={24} space={12}>
              <Button className={'lg'} style={{borderRadius: '4px'}} onClick={this.onBarcode}><Icon className="icon-qrcode-line size20" style={{marginRight: '6px'}}/>扫码添加</Button>
              <Button className={'lg'} style={{borderRadius: '4px'}} onClick={this.onWritecode}><Icon className="icon-plus size20" style={{marginRight: '6px'}}/>录入添加</Button>
            </Grid>
          </Group>
          <Group>
            <List caption={<div><span className="color-badge" style={Required}></span><span>扫码清单</span></div>} className={`list-li-oneline color-sub${detail.wine_code && detail.wine_code.length ? '' : ' border-b'}`} style={{padding: detail.wine_code && detail.wine_code.length ? '12px 12px 0 0' : '12px 12px 12px 0', marginLeft: '16px'}}/>
            {detail.wine_code &&
              detail.wine_code.map((item, index) => {
                return <InputNumber key={index} args={index} value={item} onChange={this.onChangeBarcode} clear valueBindProp placeholder="请输入" liconClassName="icon-rdo-minus-fill color-primary" onClickLicon={this.onDelBarcode} style={{padding: '0 0 0 12px'}} clearStyle={{height: '42px', width: '42px', marginLeft: '0'}} clearClassName="ricon close-icon-clear size18 border-b" inputClassName="border-b"/>
              })
            }
            <List caption={<div><span className="color-badge" style={Required}>*</span><span>拍摄视频</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            {detail.banquet_id && <WqVideoRecord id={'report' + detail.banquet_id} style={{margin: '10px 12px 10px 16px'}} onChange={this.onRecordVideo}/>}
            <hr style={{marginLeft: '16px'}}/>
            <WqImgUpload list={detail.pic_path_list} onChange={this.onWqPhotoChange}/>
            <hr style={{marginLeft: '16px'}}/>
            <List caption={<div><span className="color-badge" style={Required}></span><span>备注说明</span></div>} className="list-li-oneline color-sub" style={Caption}/>
            <InputArea value={detail.remark} args={'remark'} onChange={this.onChange} className="border-b" style={InputStyle} inputStyle={{padding: '10px 0'}} valueBindProp placeholder="请输入"/>
          </Group>
        </Container>}
        {isLoading && <Loading style={{top: '44px'}}/>}
      </Page>
    );
  }
}
