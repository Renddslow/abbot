import React, { useState, useEffect, useContext } from 'react';

export type User = {
  email: string;
  name: string;
  id: string;
  token: string;
};

type AuthContextProps = {
  user?: User;
};

type Props = {
  children: (props: { loading: boolean; loggedIn: boolean }) => JSX.Element;
};

export const AuthContext = React.createContext<Partial<AuthContextProps>>({});

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  console.log(!!user);

  useEffect(() => {
    fetch('/.netlify/functions/me')
      .then((d) => d.json())
      .then((d) => {
        setUser(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children({ loggedIn: !!user, loading })}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
