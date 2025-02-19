/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Input, Table } from 'reactstrap';
import { ApplicationData, FormSubmission } from '../../shared/data';
import { EntryNodeList } from './entry';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../providers';

export const HomePage: FC = () => {
  const [results, setResults] = useState<ApplicationData[] | undefined>();
  const [creating, setCreating] = useState(false);

  const history = useHistory();

  const fetchData = useCallback(async () => {
    setResults(await api.getData());
  }, [setResults]);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);
  return (
    <>
      <h1>Welcome{user && ` ${user.username}`} to My App</h1>
      <p>
        This page aims to be an extension of <a href="https://a2-zenisbestwolf.glitch.me/">a2</a>.
      </p>
      {!user && (
        <>
          <Button
            onClick={() => {
              history.push('signup');
            }}
          >
            Sign Up
          </Button>{' '}
          <Button
            onClick={() => {
              history.push('login');
            }}
            color="primary"
          >
            Login
          </Button>
        </>
      )}
      {user && (
        <Button
          onClick={() => {
            localStorage.removeItem('username');
            setUser(undefined);
          }}
        >
          Log Out
        </Button>
      )}
      <Table>
        <thead>
          <tr>
            <th>Response ID</th>
            <th>Author</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>
              <Button
                onClick={() => {
                  setCreating(true);
                }}
                disabled={!user}
                color="success"
              >
                Create
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {creating && (
            <NewEntry
              disable={() => {
                setCreating(false);
              }}
              username={user?.username ?? 'unknown'}
              refresh={fetchData}
            />
          )}
          <EntryNodeList user={user} refresh={fetchData} entries={results} />
        </tbody>
      </Table>
    </>
  );
};

const NewEntry: FC<{
  readonly username: string;
  disable: () => void;
  refresh: () => Promise<void>;
}> = ({ username, disable, refresh }) => {
  const [entry, setEntry] = useState<FormSubmission>({
    location: '',
    start: new Date(),
    end: new Date(),
  });

  // makes object state easier to manipulate
  const updateEntry = useCallback(
    (key: keyof FormSubmission, value: string | Date) => {
      setEntry({
        ...entry,
        [key]: value,
      });
    },
    [entry, setEntry],
  );

  const submit = useCallback(async () => {
    await api.postEntry(entry);
    disable();
    await refresh();
  }, [entry, disable, refresh]);

  return (
    <tr>
      <td>
        <Button onClick={disable} color="danger">
          Cancel
        </Button>
      </td>
      <td>{username}</td>
      <td>
        <Input
          type="text"
          required
          placeholder="123 Main Street"
          onChange={(e) => {
            updateEntry('location', e.target.value);
          }}
        />
      </td>
      <td>
        <Input
          type="date"
          required
          onChange={(e) => {
            updateEntry('start', e.target.valueAsDate!);
          }}
        ></Input>
      </td>
      <td>
        <Input
          type="date"
          required
          onChange={(e) => {
            updateEntry('end', e.target.valueAsDate!);
          }}
        />
      </td>
      <td>
        <Button
          onClick={() => {
            void submit();
          }}
          color="success"
        >
          Submit
        </Button>
      </td>
    </tr>
  );
};
