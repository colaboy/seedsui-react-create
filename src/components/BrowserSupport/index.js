import React, { Component } from 'react';
import {withRouter} from 'react-router';
import Page from 'seedsui-react/lib/Page';
import Grid from 'seedsui-react/lib/Grid';
import chrome from './chrome.png';
import safari from './safari.png';
import safe from './360.png';
import sogou from './sogou.png';

@withRouter
export default class BrowserSupport extends Component {
  render() {
    const list = [
      {
        iconSrc: chrome,
        caption: 'Google Chrome'
      },
      {
        iconSrc: safari,
        caption: 'Safari'
      },
      {
        iconSrc: safe,
        caption: '360浏览器'
      },
      {
        iconSrc: sogou,
        caption: '搜狗浏览器'
      }
    ]
    return (
      <Page style={{backgroundColor: 'white'}}>
        <div className="font-size-xl text-center" style={{marginTop: '40px'}}>建议更新您的浏览器</div>
        <div className="wingmargin-lg" style={{marginTop: '40px'}}>尊敬的用户您好：</div>
        <div className="wingmargin-lg" style={{marginTop: '15px'}}>为了提升您的浏览速度和使用体验，我们使用了最新的技术来搭建我们的网站。检测到您当前的浏览器版本过低不支持这些技术，建议您更新浏览器，保证您的正常访问。</div>
        <div className="wingmargin-lg" style={{marginTop: '30px'}}>建议使用以下浏览器：</div>
        <Grid col="4" list={list} className="grid-bordered border-t" iconClassName="size80" style={{marginTop: '20px'}}/>
      </Page>
    );
  }
}
