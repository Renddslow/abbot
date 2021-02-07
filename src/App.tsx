import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthProvider from './Auth';

import Login from './pages/Login';
import Relationships from './pages/Relationships';

import Header from './components/Header';
import Requests from './pages/Requests/Requests';

function App() {
  return (
    <Router>
      <AuthProvider>
        {(loggedIn) => (
          loggedIn ?
          <div className="App">
            <Header />
            <Switch>
              <Route path="/relationships/:id" component={() => <div />} />
              <Route path="/relationships" component={Relationships} />

              <Route path="/requests" component={Requests} />
            </Switch>
          </div> :
          <Login />
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;
