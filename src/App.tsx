import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, concat } from '@apollo/client';

import AuthProvider from './Auth';

import Login from './pages/Login';
import Relationships from './pages/Relationships';

import Header from './components/Header';
import Requests from './pages/Requests/Requests';

const httpLink = new HttpLink({ uri: '/.netlify/functions/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  const store = JSON.parse(window.localStorage.getItem('fc:abbot:user') || '{}');
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${store.token}`,
    }
  });

  return forward(operation);
})


const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {(loggedIn) =>
          loggedIn ? (
            <div className="App">
              <Header />
              <Switch>
                {
                  /* TODO:
                    - Request modals
                      - Assignment
                      - Todo items
                   */
                }
                <Route path="/relationships" component={Relationships} />
                <Route path="/requests" component={Requests} />
                <Route path="/*" component={() => <Redirect to="/requests" />} />
              </Switch>
            </div>
          ) : (
            <Login />
          )
        }
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
