import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'seedsui-react/lib/Dialog';
import Page from 'seedsui-react/lib/Page';
import Header from 'seedsui-react/lib/Header';
import Container from 'seedsui-react/lib/Container';
import Titlebar from 'seedsui-react/lib/Titlebar';
import Footer from 'seedsui-react/lib/Footer';
import Button from 'seedsui-react/lib/Button';
import InputPicker from 'seedsui-react/lib/InputPicker';
import InputWaiqin from 'seedsui-react/lib/InputWaiqin';
import Grid from 'seedsui-react/lib/Grid';
import InputDate from 'seedsui-react/lib/InputDate';
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
    banquetTypeList: PropTypes.array,
    banquetTypeName: PropTypes.string,
    banquetType: PropTypes.string,
    banquetStatusList: PropTypes.array,
    banquetStatusName: PropTypes.string,
    banquetStatus: PropTypes.string,
    storeName: PropTypes.string,
    storeId: PropTypes.string,
    creatimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    creatorName: PropTypes.string,
    banquetDate: PropTypes.string,
    endDate: PropTypes.string,
  };
  static defaultProps = {
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount () {
  }
  onSubmit = () => {
    if (this.props.onSubmit) this.props.onSubmit()
  }
  onChangeBanquetType = (val, opt) => {
    this.props.onChange({
      banquetTypeName: val,
      banquetType: opt.key
    });
  }
  onCreatimeStart = (val) => {
    this.props.onChange({
      creatimeStart: val
    });
  }
  onCreateTimeEnd = (val) => {
    this.props.onChange({
      createTimeEnd: val
    });
  }
  onBanquetDate = (val) => {
    this.props.onChange({
      banquetDate: val
    });
  }
  onEndDate = (val) => {
    this.props.onChange({
      endDate: val
    });
  }
  onChangeBanquetStatus = (val, opt) => {
    console.log(opt)
    this.props.onChange({
      banquetStatusName: val,
      banquetStatus: opt.key
    });
  }
  onChangeStore = (val, opt) => {
    this.props.onChange({
      storeName: val,
      storeId: opt.key
    });
  }
  onCreatorName = (val) => {
    this.props.onChange({
      creatorName: val
    });
  }
  onReset = () => {
    this.props.onChange({
      banquetTypeName: '',
      banquetType: '',
      banquetStatusName: '',
      banquetStatus: '',
      storeName: '',
      storeId: '',
      creatimeStart: '',
      createTimeEnd: '',
      creatorName: ''
    });
  }
  onToday = () => {
    var dateStr = new Date().format('yyyy-MM-dd');
    this.props.onChange({
      creatimeStart: dateStr,
      createTimeEnd: dateStr
    });
  }
  onSevenDay = () => {
    var startDate = new Date();
    startDate.prevDate(6);
    var endDate = new Date();
    this.props.onChange({
      creatimeStart: startDate.format('yyyy-MM-dd'),
      createTimeEnd: endDate.format('yyyy-MM-dd')
    });
  }
  onMonth = () => {
    var date = new Date();
    this.props.onChange({
      creatimeStart: date.firstMonthDate().format('yyyy-MM-dd'),
      createTimeEnd: date.lastMonthDate().format('yyyy-MM-dd')
    });
  }
  render() {
    const {show, onHide, banquetTypeList, banquetTypeName, banquetType, banquetStatusList, banquetStatusName, banquetStatus, storeName, storeId, creatimeStart, createTimeEnd, creatorName, banquetDate, endDate} = this.props;
    return (
      <Dialog portal={this.props.portal} show={show} animation="slideLeft" duration={200} onClickMask={onHide} position="right" style={{width: '80%', height: '100%', backgroundColor: 'white'}}>
        <Page style={{backgroundColor: 'white'}}>
          <Header>
            <Titlebar caption="筛选" onClickBack={onHide}/>
          </Header>
          <Container style={{bottom: '50px', paddingLeft: '12px'}}>
            <p className="color-sub" style={CaptionStyle}>申报日期</p>
            <Grid col="3" className="between border-b" wing={12} space={12}>
              <Button onClick={this.onToday} className="lg" style={{borderRadius: '4px'}}>今日</Button>
              <Button onClick={this.onSevenDay} className="lg" style={{borderRadius: '4px'}}>7天内</Button>
              <Button onClick={this.onMonth} className="lg" style={{borderRadius: '4px'}}>本月</Button>
            </Grid>
            <p className="color-sub" style={CaptionStyle}>申报开始日期</p>
            <InputDate valueBindProp max={createTimeEnd} value={creatimeStart} onChange={this.onCreatimeStart} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>申报结束日期</p>
            <InputDate valueBindProp min={creatimeStart} value={createTimeEnd} onChange={this.onCreateTimeEnd} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>宴会类型</p>
            <InputPicker value={banquetTypeName} valueForKey={banquetType} onChange={this.onChangeBanquetType} list={banquetTypeList} className="border-b" valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>状态</p>
            <InputPicker value={banquetStatusName} valueForKey={banquetStatus} onChange={this.onChangeBanquetStatus} list={banquetStatusList} className="border-b" valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>终端</p>
            <InputWaiqin value={storeName} valueForKey={storeId} onChange={this.onChangeStore} chooseType="getCustomer" chooseParams={{tradeType: '3'}} className="border-b" valueBindProp placeholder="请选择" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>提交日期起</p>
            <InputDate valueBindProp max={endDate} value={banquetDate} onChange={this.onBanquetDate} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>提交日期止</p>
            <InputDate valueBindProp min={banquetDate} value={endDate} onChange={this.onEndDate} placeholder="请选择" className="border-b" riconClassName="shape-arrow-right sm"/>
            <p className="color-sub" style={CaptionStyle}>申报人</p>
            <InputText valueBindProp value={creatorName} onChange={this.onCreatorName} clear placeholder="请输入提交人" className="border-b"/>
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
