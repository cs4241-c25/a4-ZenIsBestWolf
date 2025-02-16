import React, { FC } from 'react';
import { Container } from 'reactstrap';
import { HomePage } from './components/home';
import { SignUp } from './components/signup';
import { LoginPage } from './components/login';
import { Route, Switch } from 'react-router-dom';

export const App: FC = () => {
  return (
    <Container>
      <Switch>
        <Route component={HomePage} path="/" exact />
        <Route component={SignUp} path="/signup" exact />
        <Route component={LoginPage} path="/login" exact />
      </Switch>
    </Container>
  );
};
