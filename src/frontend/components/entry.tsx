import React, { FC, useCallback } from 'react';
import { ApplicationData } from '../../shared/data';
import { Button } from 'reactstrap';
import { User } from '../../shared/user';

export const EntryNodeList: FC<{
  readonly entries?: ApplicationData[];
  readonly user?: User;
  refresh: () => Promise<void>;
}> = ({ entries, user, refresh }) => {
  if (!entries) {
    return null;
  }

  return entries.map((entry) => (
    <EntryNode
      key={entry.id}
      entry={entry}
      username={user?.username ?? 'unknown'}
      refresh={refresh}
    />
  ));
};

const EntryNode: FC<{
  readonly entry: ApplicationData;
  readonly username: string;
  refresh: () => Promise<void>;
}> = ({ entry, username, refresh }) => {
  return (
    <tr>
      <td>{entry.id}</td>
      <td>{entry.name}</td>
      <td>{entry.location}</td>
      <td>{entry.start.toDateString()}</td>
      <td>{entry.end.toDateString()}</td>
      <td>
        <DeleteButton refresh={refresh} id={entry.id} disabled={entry.name !== username} />
      </td>
    </tr>
  );
};

const DeleteButton: FC<{
  readonly id: string;
  readonly disabled: boolean;
  refresh: () => Promise<void>;
}> = ({ id, disabled, refresh }) => {
  const deleteEntry = useCallback(async () => {
    await api.deleteEntry(id);
    void refresh();
  }, [id, refresh]);
  return (
    <Button
      color="danger"
      disabled={disabled}
      onClick={() => {
        void deleteEntry();
      }}
    >
      Delete
    </Button>
  );
};
