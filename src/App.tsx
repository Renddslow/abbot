import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import AuthProvider from './Auth';

import Login from './pages/Login';
import Relationships from './pages/Relationships';

import Header from './components/Header';
import Requests from './pages/Requests/Requests';
import Request from './pages/Request/Request';

function App() {
  const location = useLocation();
  // @ts-ignore
  const background = location.state && location.state.background;

  return (
    <AuthProvider>
      {(loggedIn) =>
        loggedIn ? (
          <div className="App">
            <Header />
            <Switch location={background || location}>
              <Route path="/relationships/:id" component={() => <div />} />
              <Route exact path="/relationships" component={Relationships} />

              {
                /* TODO:
                  - Request modals
                    - Assignment
                    - Todo items
                 */
              }
              <Route exact path="/requests" component={Requests} />
              <Route path="/*" component={() => <Redirect to="/requests" />} />
            </Switch>
            { background && <Route path="/requests/:id" component={Request} /> }
          </div>
        ) : (
          <Login />
        )
      }
    </AuthProvider>
  );
}

export default App;
