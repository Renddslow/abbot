import React, {useEffect, useState} from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, concat } from '@apollo/client';
import styled from 'styled-components';

import Navigation from './components/Navigation';
import Relationships from './pages/Relationships/Relationships';

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
});

const Grid = styled.div<{ drawerOpen: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr) ${({ drawerOpen }) => drawerOpen ? `minmax(240px, 30%)` : '0px'};
  width: 100%;
  min-height: 100%;
  transition: 0.2s ease-in;
`;

const Main = styled.main`
  width: 100%;
  min-height: 100%;
  background: #eff0fb;
  display: block;
  padding: 64px 24px 24px 56px;
`;

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const regexpr = /^\/(relationships)\/.*$/;
    const unlisten = history.listen((location) => {
      setDrawerOpen(regexpr.test(location.pathname));
    });
    return () => unlisten();
  }, []);

  return (
    <ApolloProvider client={client}>
      <Grid drawerOpen={drawerOpen}>
        <Navigation />
        <Main>
          <Switch>
            <Route path="/relationships" component={Relationships} />
          </Switch>
        </Main>
        <div />
      </Grid>
    </ApolloProvider>
  );
}

export default App;
