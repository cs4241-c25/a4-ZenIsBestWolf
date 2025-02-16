import React, { FC, useCallback, useState } from 'react';
import { Button, Form, Input } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export const LoginPage: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const attemptLogin = useCallback(async () => {
    if (username.length < 0) {
      alert('Please provide a username.');
      return;
    }

    if (password.length < 0) {
      alert('Please provide a password.');
      return;
    }
    await api.authenticate(username, password);

    // setUser({ username });
    history.push(`/`);
  }, [username, password, history]);

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
