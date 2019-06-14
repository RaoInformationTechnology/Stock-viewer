import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Create from './components/Create';
import Login from './components/Login';
import Companylist from './components/Company-list';
import Demo from './components/demo';


ReactDOM.render(
  <HashRouter>
  <div>
  <Route exact path='/' component={App} />
  <Route path='/create' render={() =>( localStorage.getItem('email1') ? ( <Route  component={Companylist} />)
          : (<Route component={Create} />) 
          )}/>
  <Route path='/login' render={() =>( localStorage.getItem('email1') ? ( <Route  component={Companylist} />)
          : (<Route component={Login} />) 
          )}/>
  <Route path='/Company-list' render={() =>( localStorage.getItem('email1') ? ( <Route  component={Companylist} />)
          : (<Route component={Login} />)
        )} />
  </div>
  </HashRouter>,
  document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();