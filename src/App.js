import React from 'react';
import './App.css';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import ChattingPage from './components/chatting_page/chatting_page';
import LoginPage from './components/login_page/login_page';
import RegisterPage from './components/register_page/register_page';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ChattingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
