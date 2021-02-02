import React, { useEffect } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import ChattingPage from './components/chatting_page/chatting_page';
import LoginPage from './components/login_page/login_page';
import RegisterPage from './components/register_page/register_page';
import firebase from './firebase';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/user_action';
function App() {
  const history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {

      if (user) {
        history.push('/');
        dispatch(setUser(user));
      } else {
        history.push('/login');
        dispatch(clearUser(user))
      }
    })
  }, [history, dispatch])
  if (isLoading) {
    return (
      <div>
        loading...
      </div>
    )

  } else {
    return (

      <Switch>
        <Route exact path="/" component={ChattingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>

    );
  }

}

export default App;
