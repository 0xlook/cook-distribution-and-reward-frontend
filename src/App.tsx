import React, { useState } from 'react';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Main } from '@aragon/ui';
import { updateModalMode } from './utils/web3';
import { storePreference, getPreference } from './utils/storage';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import PoolList from "./components/PoolList";
import Distribution from "./components/Distribution";
import Admin from "./components/Admin";

import colors from './constants/colors';
function App() {
  const storedTheme = getPreference('theme', 'light');

  const [user, setUser] = useState(''); // the current connected user
  const [theme, setTheme] = useState(storedTheme);

  const updateTheme = (newTheme:string) => {
    setTheme(newTheme);
    updateModalMode(newTheme);
    storePreference('theme', newTheme);
  };
  return (
    <Router>
      <Main assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui/`} theme={colors} layout={false}>
      <div style={{margin:"0 auto", maxWidth:1500}}>
        <NavBar user={user} setUser={setUser} theme={theme} updateTheme={updateTheme} />

        <Switch>
          <Route path="/distribution/"><Distribution user={user} /></Route>
          <Route path="/pools/"><PoolList user={user} /></Route>
          <Route path="/admin/"><Admin user={user}/></Route>
          <Route path="/"><HomePage /></Route>
        </Switch>
        </div>
      </Main>
    </Router>
  );
}

export default App;
