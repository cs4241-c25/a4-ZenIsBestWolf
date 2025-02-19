import React, { FC, useCallback, useContext, useState } from 'react';
import { Button, Form, Input } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../providers';

export const LoginPage: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const { setUser } = useContext(UserContext);

  const attemptLogin = useCallback(async () => {
    if (username.length < 0) {
      alert('Please provide a username.');
      return;
    }

    if (password.length < 0) {
      alert('Please provide a password.');
      return;
    }

    const authUser = await api.authenticate(username, password);

    setUser(authUser);
    history.push(`/`);
  }, [username, password, setUser, history]);

  return (
    <>
      <h1>Login</h1>
      <p>Please log in.</p>
      <Form>
        <Input
          type="text"
          name="username"
          required
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          type="password"
          name="password"
          required
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button onClick={() => void attemptLogin()}>Log In</Button>
      </Form>
    </>
  );
};
