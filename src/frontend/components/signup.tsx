import React, { FC, useCallback, useState } from 'react';
import { Button, Form, Input } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export const SignUp: FC = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const history = useHistory();

  const submitUser = useCallback(async () => {
    if (!username || username.length < 1) {
      alert('Invalid username.');
      return;
    }

    if (!password || password.length < 1) {
      alert('Invalid password.');
      return;
    }

    await api.newUser(username, password);
    history.push('/login');
  }, [username, password, history]);

  return (
    <>
      <h1>Sign Up</h1>
      <p>An account is required to utilize this application. Sign up below.</p>
      <Form>
        <Input
          type="text"
          placeholder="Enter a username..."
          required
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          type="password"
          placeholder="Enter a password..."
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            void submitUser();
          }}
        >
          Sign Up
        </Button>
      </Form>
    </>
  );
};
