import React, { useState, useEffect, useContext } from 'react';
import qs from 'qs';

export type User = {
  email: string;
  name: string;
  id: string;
  token: string;
};

type AuthContextProps = {
  user?: User;
  logout: () => void;
};

type Props = {
  children: (loggedIn: boolean) => JSX.Element;
}

export const AuthContext = React.createContext<Partial<AuthContextProps>>({});

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('fc:abbot:user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search || '', { ignoreQueryPrefix: true });
      if (params && params.token) {
        const [, userData] = (params.token as string).split('.');
        const user = {
          ...JSON.parse(atob(userData)),
          token: params.token,
        };
        window.location.search = '';
        setUser(user);
        window.localStorage.setItem('fc:abbot:user', JSON.stringify(user));
      }
    }
  }, []);

  const logout = () => {
    window.localStorage.setItem('fc:abbot:user', '');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
      }}
    >
      {children(!!user)}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
