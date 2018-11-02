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
import Grid from 'seedsui-react/lib/Grid';
import List from 'seedsui-react/lib/List';
import Footer from 'seedsui-react/lib/Footer';
import Button from 'seedsui-react/lib/Button';
import Timeline from 'seedsui-react/lib/Timeline';
import DB from 'seedsui-react/lib/DB';
import RouteComment from 'seedsui-react/lib/RouteComment';
import {getDetail, save, saveEnd} from 'store/modules/checkDetail';

export default
@withRouter
@connect(state => ({
  isLoading: state.checkDetail.isLoading,
  detail: state.checkDetail.detail,
  hasMore: state.checkDetail.hasMore
}), {
  getDetail,
  save,
  saveEnd
})
class CheckDetail extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    hasMore: PropTypes.number,
    detail: PropTypes.object,
    getDetail: PropTypes.func,
    save: PropTypes.func,
    saveEnd: PropTypes.func
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
  onFirstApproverCancel = (value, obj) => {
    if (!value.replace(/\s*/g, '')) {
      Bridge.showToast('请输入再次审核的原因', {mask: false});
      return;
    }
    this.save({
      approve_id: this.props.match.params.approveId,
      approve_opinion: value,
      approve_type: '3'
    }, '再次审核成功');
  }
  onFirstApproverSubmit = (value, obj) => {
    if (!value.replace(/\s*/g, '')) {
      Bridge.showToast('请输入打回的原因', {mask: false});
      return;
    }
    this.save({
      approve_id: this.props.match.params.approveId,
      approve_opinion: value,
      approve_type: '2'
    }, '打回成功');
  }
  onFirstReturn = (value) => {
    // 打回时必须输入
    if (!value.replace(/\s*/g, '')) {
      Bridge.showToast('请输入打回原因', {mask: false});
      return;
    }
    this.save({
      approve_id: this.props.match.params.approveId,
      approve_opinion: value,
      approve_type: '2'
    }, '打回成功');
  }
  onFirstSuccess = (value) => {
    this.save({
      approve_id: this.props.match.params.approveId,
      approve_opinion: value,
      approve_type: '1'
    }, '审核通过');
  }
  onEndReturn = (value) => {
    // 打回时必须输入
    if (!value.replace(/\s*/g, '')) {
      Bridge.showToast('请输入打回原因', {mask: false});
      return;
    }
    this.saveEnd({
      approve_id: this.props.match.params.approveId,
      approve_opinion: value,
      approve_type: '2'
    }, '打回成功');
  }
  onEndSuccess = (value) => {
    this.saveEnd({
      approve_id: this.props.match.params.approveId,
      approve_opinion: value,
      approve_type: '1'
    }, '审核通过');
  }
  onFirstApproverPop = () => {
    this.props.history.push(`/checkDetail/1/${this.props.match.params.approveId}/firstApproverPop`);
  }
  onFirstReturnPop = () => {
    this.props.history.push(`/checkDetail/1/${this.props.match.params.approveId}/firstReturnPop`);
  }
  onFirstSuccessPop = () => {
    this.props.history.push(`/checkDetail/1/${this.props.match.params.approveId}/firstSuccessPop`);
  }
  onEndReturnPop = () => {
    this.props.history.push(`/checkDetail/2/${this.props.match.params.approveId}/endReturnPop`);
  }
  onEndSuccessPop = () => {
    this.props.history.push(`/checkDetail/1/${this.props.match.params.approveId}/endSuccessPop`);
  }
  save = (params, msg) => {
    this.props.save(params).then((result) => {
      if (result.code === '1') {
        // this.loadData();
        DB.setSession('listrefresh', 'true');
        Bridge.showToast(msg || '提交成功', {
          onSuccess: () => {
            this.props.history.go(-2);
          }
        });
      } else {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常，请稍后再试', {mask: false});
    });
  }
  saveEnd = (params, msg) => {
    this.props.saveEnd(params).then((result) => {
      if (result.code === '1') {
        // this.loadData();
        DB.setSession('listrefresh', 'true');
        Bridge.showToast(msg || '提交成功', {
          onSuccess: () => {
            this.props.history.go(-2);
          }
        });
      } else {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常，请稍后再试', {mask: false});
    });
  }
  loadData = () => {
    const params = {
      approve_id: this.props.match.params.approveId
    };
    // 获得数据
    this.props.getDetail(params).then((result) => {
      if (result.code !== '1') {
        Bridge.showToast(result.message, {mask: false});
      }
    }).catch((err) => {
      Bridge.showToast('请求异常，请稍后再试', {mask: false});
    });
  }
  render() {
    const {isLoading, hasMore, detail} = this.props;
    let mark = null;
    let topicList = [];
    let picList = [];
    // 0.未审批 1.初审通过 2.初审打回 3.终审通过 4.终审打回
    if (detail && detail.detail && detail.detail.businessApproveStatus) {
      switch (detail.detail.businessApproveStatus) {
        case '0':
          mark = <Mark className="warn">未审批</Mark>;
          break;
        case '1':
          mark = <Mark className="success">初审通过</Mark>;
          break;
        case '2':
          mark = <Mark className="cancel">初审打回</Mark>;
          break;
        case '3':
          mark = <Mark className="success">终审通过</Mark>;
          break;
        case '4':
          mark = <Mark className="cancel">终审打回</Mark>;
          break;
        default:
          mark = null;
      }
      topicList = [
        {
          name: '应返利金额:',
          value: '¥' + detail.detail.amount,
          show: detail.detail.amount
        },
        {
          name: '客户经理:',
          value: detail.detail.managerName
        },
        {
          name: '下单时间:',
          value: detail.detail.createOrderTime + detail.detail.createOrderUserName
        },
        {
          name: '订单备注:',
          value: detail.detail.orderRemark
        },
        {
          name: '确认时间:',
          value: detail.detail.orderDispatchTime + detail.detail.orderDispatchUserName
        },
        {
          name: '发货时间:',
          value: detail.detail.sendTime + detail.detail.sendUserName
        },
        {
          name: '签收时间:',
          value: detail.detail.signTime + detail.detail.signUserName
        }
      ];
      if (detail.detail.pictures) {
        picList = detail.detail.pictures.split(',').map((pic) => {
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
          <Titlebar caption="返利红包详情"/>
        </Header>
        {detail && detail.detail && <Container style={{paddingBottom: '40px'}}>
          <Group style={{padding: '1px 0', marginTop: '-1px', backgroundColor: '#fff9e1'}}>
            <div className="flex flex-middle" style={{padding: '12px 12px 0 12px'}}>
              <p className="flex-1">{detail.detail.cmName}</p>
              {mark}
            </div>
            <Attributes list={topicList} showValidValue/>
            <Grid list={picList} className="grid-album" iconClassName="icon-full" wing={12} space={12}/>
          </Group>
          {detail.pdList.length && <Group>
            <List className="list-li-oneline border-b" caption="商品清单" rcaption={`共${detail.pdList.length}种`}/>
            {detail.pdList.map((pd, index) => {
              return <List className="border-b" key={index} caption={pd.name + pd.spec} sndcaption={<div className="flex"><p className="flex-1">数量: {pd.num + pd.reportunitname}</p><p className="color-body">应返利金额: ¥{pd.amount.toFixed(2)}</p></div>} />
            })}
          </Group>}
          {/* 只有初审才显示审批历程 */}
          {this.props.match.params.type === '1' && detail.logList.length > 0 && <Group>
            <List caption="审批历程" className="border-b"/>
            <Timeline list={detail.logList.map((log, index) => {
              let businessOperateType = '';
              switch (log.businessOperateType) {
                case '1':
                  businessOperateType = '初审通过';
                  break;
                case '2':
                  businessOperateType = '初审打回';
                  break;
                case '3':
                  businessOperateType = '初审返审核';
                  break;
                case '4':
                  businessOperateType = '终审通过';
                  break;
                case '5':
                  businessOperateType = '终审打回';
                  break;
                default:
                businessOperateType = '';
              }
              return {
                active: index === 0,
                content: <div style={{padding: '10px 0'}}><p>{log.approveUser + ' ' + log.approveTime}</p><p style={{marginTop: '5px'}}>{businessOperateType + (log.approveOpinion ? ': ' + log.approveOpinion : '')}</p></div>
              }
            })}/>
          </Group>}
        </Container>}
        {detail && detail.detail && <Footer className="flex" style={{backgroundColor: 'white'}}>
          {/* 初审: 0.未审批时, 显示打回和通过, 1.初审通过时,显示反审核 */}
          {this.props.match.params.type === '1' && detail.detail.businessApproveStatus === '1' && <Button className="lg flex-1" style={{borderWidth: '1px 0 0 0'}} onClick={this.onFirstApproverPop}>反审核</Button>}
          {this.props.match.params.type === '1' && detail.detail.businessApproveStatus === '0' && [<Button key={`btn1`} className="lg flex-1" style={{borderWidth: '1px 0 0 0'}} onClick={this.onFirstReturnPop}>打回</Button>, <Button key={`btn2`} className="lg flex-1" style={{borderWidth: '1px 0 0 1px'}} onClick={this.onFirstSuccessPop}>通过</Button>]}
          {/* 终审: 1.初审通过时,显示打回和通过 */}
          {this.props.match.params.type === '2' && detail.detail.businessApproveStatus === '1' && [<Button key={`btn1`} className="lg flex-1" style={{borderWidth: '1px 0 0 0'}} onClick={this.onEndReturnPop}>打回</Button>, <Button key={`btn2`} className="lg flex-1" style={{borderWidth: '1px 0 0 1px'}} onClick={this.onEndSuccessPop}>通过</Button>]}
        </Footer>}
        {hasMore === 404 &&  <Notice caption="暂无数据" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {hasMore === -1 &&  <Notice caption="请求错误,请稍后重试" iconClassName="notice-icon-nodata" style={{top: '44px'}}/>}
        {isLoading && <Loading style={{top: '44px'}}/>}
        <Route
          path={`${this.props.match.path}/firstApproverPop`}
          render={() =>
            <RouteComment
              buttons={[
                {
                  valid: false,
                  className: 'lg bg-white',
                  caption: '再次审核',
                  onClick: this.onFirstApproverCancel
                },
                {
                  valid: false,
                  className: 'lg primary',
                  caption: '直接打回',
                  onClick: this.onFirstApproverSubmit
                }
              ]}
              maxLength="100"
              title="反审核"
              placeholder="请填写审批意见"
            />
          }
        />
        <Route
          path={`${this.props.match.path}/firstReturnPop`}
          render={() => 
            <RouteComment
              buttons={[
                {
                  valid: false,
                  className: 'lg primary',
                  caption: '提交',
                  onClick: this.onFirstReturn
                }
              ]}
              maxLength="100"
              title="打回"
              placeholder="请输入打回原因"
            />
          }
        />
        <Route
          path={`${this.props.match.path}/firstSuccessPop`}
          render={() =>
            <RouteComment
              buttons={[
                {
                  valid: false,
                  className: 'lg primary',
                  caption: '提交',
                  onClick: this.onFirstSuccess
                }
              ]}
              maxLength="100"
              title="审核通过"
              placeholder="请输入审批原因"
            />
          }
        />
        <Route
          path={`${this.props.match.path}/endReturnPop`}
          render={() =>
            <RouteComment
              buttons={[
                {
                  valid: false,
                  className: 'lg primary',
                  caption: '提交',
                  onClick: this.onEndReturn
                }
              ]}
              maxLength="100"
              title="打回"
              placeholder="请输入打回原因"
            />
          }
        />
        <Route
          path={`${this.props.match.path}/endSuccessPop`}
          render={() =>
            <RouteComment
              buttons={[
                {
                  valid: false,
                  className: 'lg primary',
                  caption: '提交',
                  onClick: this.onEndSuccess
                }
              ]}
              maxLength="100"
              title="审核通过"
              placeholder="请输入审批原因"
            />
          }
        />
      </Page>
    );
  }
}
