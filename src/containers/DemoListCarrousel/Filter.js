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
    cmName: PropTypes.string
  };
  static defaultProps = {
    cmName: ''
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount () {
  }
  onCmId = () => {
    Bridge.getCustomer({
      id: this.props.cmId,
      name: this.props.cmName,
      tradeType: '2,3', // 门店和经销商
      dms_type: '4',
      onSuccess: (args) => {
        this.props.onChange({
          cmId: args.id,
          cmName: args.name
        });
      }
    })
  }
  onSubmit = () => {
    if (this.props.onSubmit) this.props.onSubmit()
  }
  onReset = () => {
    this.props.onChange({
      cmName: ''
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
            <p className="color-sub" style={CaptionStyle}>客户名称</p>
            <InputText valueBindProp readOnly value={this.props.cmName} onClick={this.onCmId} placeholder="点击输入" className="border-b" riconClassName="shape-arrow-right sm"/>
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
