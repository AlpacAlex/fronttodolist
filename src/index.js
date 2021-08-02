import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SignIn from './SignIn';
import SignUn from './SignUp';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Switch, Route, Link, Redirect } from "react-router-dom";


ReactDOM.render(
  <HashRouter>
    <Redirect to="/signin" />
    <Switch>
      <Route exact path="/signin" component={SignIn}/>
      <Route exact path="/signup" component={SignUn}/>
    </Switch>
  </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();