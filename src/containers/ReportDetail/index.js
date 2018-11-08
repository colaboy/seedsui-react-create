import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Container from 'seedsui-react/lib/Container';
import Loading from 'seedsui-react/lib/Loading';
import Notice from 'seedsui-react/lib/Notice';
import Bridge from 'seedsui-react/lib/Bridge';
import Group from 'seedsui-react/lib/Group';
import Mark from 'seedsui-react/lib/Mark';
import Attributes from 'seedsui-react/lib/Attributes';
import List from 'seedsui-react/lib/List';
import ImgUploader from 'seedsui-react/lib/ImgUploader';
import VideoUploader from 'seedsui-react/lib/VideoUploader';
import DB from 'seedsui-react/lib/DB';
import {getDetail, delDetail, cancelDetail, verifyDetail} from 'store/modules/reportDetail';
import ReportDetailCode from './../ReportDetailCode';

export default
@withRouter
@connect(state => ({
  isLoading: state.reportDetail.isLoading,
  detail: state.reportDetail.detail,
  hasMore: state.reportDetail.hasMore
}), {
  getDetail,
  delDetail,
  cancelDetail,
  verifyDetail
})
class ReportDetail extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    hasMore: PropTypes.number,
    detail: PropTypes.object,
    getDetail: PropTypes.func,
    delDetail: PropTypes.func,
    cancelDetail: PropTypes.func,
    verifyDetail: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    }
  }
  componentDidMount() {
    this.loadData();
  }
  componentWillUnmount() {
  }
  onClickVideo = (args) => {
    Bridge.previewVideo({src: args.src});
  }
  // 校验完成返回列表
  onDelete = () => {
    Bridge.showConfirm('确定需要删除此宴会单吗?', {
      onSuccess: (e) => {
        e.hide()
        const params = {
          id: this.props.match.params.id
        };
        this.props.delDetail(params).then((result) => {
          if (result.code === '1') {
            DB.setSession('listrefresh', 'true');
            Bridge.showToast('删除成功', {
              onSuccess: () => {
                this.props.history.goBack();
              }
            });
          } else {
            Bridge.showToast(result.message, {mask: false});
          }
        }).catch(() => {
          Bridge.showToast('删除操作异常, 请稍后再试', {mask: false});
        });
      }
    });
  }
  // 取消完成停留在详情页
  onCancel = () => {
    Bridge.showConfirm('确定需要取消此宴会单吗?', {
      onSuccess: (e) => {
        e.hide()
        const params = {
          id: this.props.match.params.id
        };
        this.props.cancelDetail(params).then((result) => {
          if (result.code === '1') {
            Bridge.showToast('取消成功', {
              onSuccess: () => {
                this.loadData();
              }
            });
          } else {
            Bridge.showToast(result.message, {mask: false});
          }
        }).catch(() => {
          Bridge.showToast('取消操作异常, 请稍后再试', {mask: false});
        });
      }
    });
  }
  // 校验完成停留在详情页
  onVerify = () => {
    const params = {
      id: this.props.match.params.id
    };
    this.props.verifyDetail(params).then((result) => {
      if (result.code === '1') {
        Bridge.showToast('校验成功', {
          onSuccess: () => {
            this.loadData();
          }
        });
      } else {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch(() => {
      Bridge.showToast('校验操作异常, 请稍后再试', {mask: false});
    });
  }
  onMerge = () => {
    this.props.history.push(`/reportEdit/edit?isFromApp=confirm`);
  }
  loadData = () => {
    const params = {
      id: this.props.match.params.id
    };
    // 获得数据
    this.props.getDetail(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常, 请稍后再试', {mask: false});
    });
  }
  showBarcodeList = () => {
    this.props.history.push(`/reportDetail/${this.props.match.params.id}/barcodeList`);
  }
  render() {
    const {isLoading, hasMore, detail} = this.props;
    let rBtns = []; // 操作按钮
    let mark = null; // 标签
    let topicAttrs = []; // 信息栏
    let picList = []; // 图片
    if (detail) {
      // 操作按钮
      if (detail.is_self === '1') {
        if (detail.approval_status === '4') { // 物流码校验中
          rBtns = [{
            caption: '校验',
            style: {color: '#FF9008'},
            onClick: this.onVerify
          }];
        } else if (detail.approval_status === '5') { // 物流码报错
          rBtns = [{
            caption: '删除',
            style: {color: '#FF9008'},
            onClick: this.onDelete
          },
          {
            caption: '修改',
            style: {color: '#FF9008'},
            onClick: this.onMerge
          }];
        } else if (detail.approval_status === '0' || detail.approval_status === '1' || detail.approval_status === '2') { // 待审批,未通过,已通过
          rBtns = [{
            caption: '取消',
            style: {color: '#FF9008'},
            onClick: this.onCancel
          }];
        }
      }
      // 标签
      switch (detail.approval_status) {
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
      };
      // 信息栏
      topicAttrs = [
        {
          name: '单据编号:',
          value: detail.code
        },
        {
          name: '宴会类型:',
          value: detail.banquet_type
        },
        {
          name: '宴会桌数:',
          value: detail.table_number
        },
        {
          name: '申报时间:',
          value: detail.create_time_str +  ' ' + detail.creator_name
        },
        {
          name: '申报人部门:',
          value: detail.creator_department
        }
      ];
      // 图片
      if (detail.pic_path) {
        picList = detail.pic_path.split(',').map((pic) => {
          return {
            id: pic,
            thumb: pic,
            src: pic
          }
        });
      }
    }
    return (
      <Page>
        <Header>
          <Titlebar caption="报备详情" rButtons={rBtns}/>
        </Header>
        <Container style={{paddingBottom: '40px'}}>
          <Group style={{padding: '1px 0', marginTop: '-1px', backgroundColor: '#fff9e1'}}>
            <div className="flex flex-middle" style={{padding: '12px 12px 0 12px'}}>
              <p className="flex-1 font-size-lg">{detail.banquet_name}</p>
              {mark}
            </div>
            <Attributes list={topicAttrs} showValidValue valueStyle={{marginLeft: '6px'}}/>
          </Group>
          <Group style={{padding: '10px 12px'}}>
            <p className="font-size-sm color-sub">宴会用酒</p>
            <p style={{marginTop: '6px'}}>{detail.product_name}</p>
          </Group>
          <Group>
            <List caption="物流码占用结果" riconClassName="shape-arrow-right sm" onClick={this.showBarcodeList}/>
          </Group>
          <Group>
            <Attributes className="wrap" valueStyle={{marginTop: '6px'}} nameClassName="font-size-sm" rowAfter={<hr style={{marginLeft: '12px'}}/>} list={[
              {
                name: '宴会开展日期',
                value: detail.banquet_date_str
              },
              {
                name: '宴会结束日期',
                value: detail.end_date_str
              },
              {
                name: '宴会开展时间',
                value: detail.banquet_time
              },
              {
                name: '宴会开展区域',
                value: detail.banquet_distrinct
              },
              {
                name: '宴会地址',
                value: detail.banquet_address
              },
              {
                name: '消费者',
                value: detail.consumer
              },
              {
                name: '联系方式',
                value: detail.consumer_phone
              },
              {
                name: '终端编码',
                value: detail.store_code
              },
              {
                name: '终端名称',
                value: detail.store_name
              },
              {
                name: '终端联系人',
                value: detail.store_linkman
              },
              {
                name: '经销商编码',
                value: detail.dealer_code
              },
              {
                name: '经销商名称',
                value: detail.dealer_name
              }
            ]}/>
            {picList && picList.length > 0 &&
              [<ImgUploader key="1" caption="拍摄照片" list={picList}/>,
              <hr key="2" style={{marginLeft: '12px'}}/>]
            }
            <VideoUploader
              caption="拍摄视频"
              list={[
              {
                src: detail.video_url,
                onClick: this.onClickVideo
              }
            ]}/>
            <hr style={{marginLeft: '12px'}}/>
            <div style={{padding: '10px 12px'}}>
              <p className="font-size-sm color-sub">备注说明</p>
              <p style={{marginTop: '6px'}}>{detail.remark}</p>
            </div>
          </Group>
        </Container>
        {hasMore === 404 &&  <Notice caption="暂无数据" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {hasMore === -1 &&  <Notice caption="请求错误,请稍后重试" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {isLoading && <Loading style={{top: '44px'}}/>}
        <Route
          path={`${this.props.match.path}/barcodeList`}
          render={() => <ReportDetailCode/>}
        />
      </Page>
    );
  }
}
