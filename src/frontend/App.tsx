import React, { FC, useCallback, useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { HomePage } from './components/home';
import { SignUp } from './components/signup';
import { LoginPage } from './components/login';
import { Route, Switch } from 'react-router-dom';
import { User } from '../shared/user';
import { UserContext } from './providers';

export const App: FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const pollUser = useCallback(async () => {
    const poll = await api.acquireUser();
    setUser(poll);
  }, [setUser]);

  useEffect(() => {
    if (!user) {
      void pollUser();
    }
  }, [pollUser, user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Container>
        <Switch>
          <Route component={HomePage} path="/" exact />
          <Route component={SignUp} path="/signup" exact />
          <Route component={LoginPage} path="/login" exact />
        </Switch>
      </Container>
    </UserContext.Provider>
  );
};
