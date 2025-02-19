import { createContext } from 'react';
import { User } from '../shared/user';

interface UserContextProps {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextProps>({} as never);
