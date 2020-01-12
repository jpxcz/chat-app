import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './privateRoute';
import Login from '../pages/loginPage';
import Chats from '../pages/chatPage';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <PrivateRoute exact path="/chats">
          <Chats />
        </PrivateRoute>
        <Route path='*' exact={true}>
          <div>404 Not Found</div>
        </Route>
      </Switch>
    </Router>
  )
}

export default Routes;