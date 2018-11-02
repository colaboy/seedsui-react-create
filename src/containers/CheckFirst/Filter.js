import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'seedsui-react/lib/Dialog';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Container from 'seedsui-react/lib/Container';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Footer from 'seedsui-react/lib/Footer';
import Button from 'seedsui-react/lib/Button';
import InputText from 'seedsui-react/lib/InputText';
import Bridge from 'seedsui-react/lib/Bridge';

const CaptionStyle = {
  marginTop: '12px',
}
export default class Filter extends Component {
  static propTypes = {
    portal: PropTypes.object,
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    // 过滤条件
    cm_id: PropTypes.string,
    cm_type: PropTypes.string,
    district_ids: PropTypes.string,
    jxs_id: PropTypes.string,
    submit_manager_id: PropTypes.string,
    cm_name: PropTypes.string,
    cm_type_name: PropTypes.string,
    district_name: PropTypes.string,
    submit_manager_name: PropTypes.string,
    jxs_name: PropTypes.string
  };
  static defaultProps = {
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount () {
    // Bridge.debug = true;
  }
  onCmId = () => {
    Bridge.getCustomer({
      id: this.props.cm_id,
      name: this.props.cm_name,
      tradeType: '2,3', // 门店和经销商
      dms_type: '4',
      onSuccess: (args) => {
        this.props.onChange({
          cm_id: args.id,
          cm_name: args.name
        });
      }
    })
  }
  onDistrictId = () => {
    Bridge.getCustomerAreaMore({
      selectedIds: this.props.district_ids,
      onSuccess: (args) => {
        let ids = [];
        let names = [];
        args.forEach(item => {
          ids.push(item.id);
          names.push(item.name);
        })
        this.props.onChange({
          district_ids: ids.join(','),
          district_name: names.join(',')
        });
      }
    })
  }
  onSubmitNanagerId = () => {
    Bridge.getContact({
      id: this.props.submit_manager_id,
      name: this.props.submit_manager_name,
      aclType: '0', // 只能看下属
      onSuccess: (args) => {
        this.props.onChange({
          submit_manager_id: args.id,
          submit_manager_name: args.name
        });
      }
    })
  }
  onJxsId = () => {
    Bridge.getCustomer({
      id: this.props.jxs_id,
      name: this.props.jxs_name,
      tradeType: '2', // 经销商
      dms_type: '2',
      onSuccess: (args) => {
        this.props.onChange({
          jxs_id: args.id,
          jxs_name: args.name
        });
      }
    })
  }
  onCmTypeId = () => {
    Bridge.getCustomerType({
      id: this.props.cm_type,
      name: this.props.cm_type_name,
      onSuccess: (args) => {
        this.props.onChange({
          cm_type: args.id,
          cm_type_name: args.name
        });
      }
    })
  }
  onSubmit = () => {
    if (this.props.onSubmit) this.props.onSubmit()
  }
  onReset = () => {
    this.props.onChange({
      cm_id: '',
      cm_type: '',
      district_ids: '',
      submit_manager_id: '',
      jxs_id: '',
      cm_name: '',
      cm_type_name: '',
      district_name: '',
      submit_manager_name: '',
      jxs_name: '',
    });
  }
  render() {
    const {show, onHide} = this.props;
    return (
      <Dialog portal={this.props.portal} show={show} animation="slideLeft" duration={200} onClickMask={onHide} position="right" style={{width: '80%', height: '100%', backgroundColor: 'white'}}>
        <Page style={{backgroundColor: 'white'}}>
          <Header>
            <Titlebar caption="筛选" onClickBack={onHide}/>
          </Header>
          <Container style={{bottom: '50px', paddingLeft: '12px'}}>
            <p className="color-sub" style={CaptionStyle}>客户</p>
            <InputText valueBindProp readOnly value={this.props.cm_name} onClick={this.onCmId} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>销售区域</p>
            <InputText valueBindProp readOnly value={this.props.district_name} onClick={this.onDistrictId} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>客户经理</p>
            <InputText valueBindProp readOnly value={this.props.submit_manager_name} onClick={this.onSubmitNanagerId} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>供货商</p>
            <InputText valueBindProp readOnly value={this.props.jxs_name} onClick={this.onJxsId} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>客户类型</p>
            <InputText valueBindProp readOnly value={this.props.cm_type_name} onClick={this.onCmTypeId} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
          </Container>
          <Footer className="flex flex-right" style={{backgroundColor: '#f0f1f2'}}>
            <Button className="xl bg-white flex-1"onClick={this.onReset}>重置</Button>
            <Button className="xl primary flex-1" onClick={this.onSubmit}>确定</Button>
          </Footer>
        </Page>
      </Dialog>
    );
  }
}
