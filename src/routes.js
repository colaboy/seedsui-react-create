import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from 'store/index.js';
import NoNetwork from 'seedsui-react/lib/NoNetwork';
// Containers
import {
  NotFound,
  Exception,
  // 页面
  ReportList
} from 'containers';
const Routes = () => (
  <Provider store={store}>
    <Router>
      <div>
      <Switch>
        {/* 页面 */}
        <Route exact path="/reportList" component={ReportList}/>

        {/* 错误页面 */}
        <Route exact path="/exception/:msg?" component={Exception}/>
        {/* 404页面 */}
        <Route component={NotFound}/>
      </Switch>
      <NoNetwork/>
      </div>
    </Router>
  </Provider>
)

export default Routes