import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Game from './areas/game/game.component';
import CreateGame from './areas/create-game/create-game.component';
import Welcome from './areas/welcome/welcome.component';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Game} path="/game" />
        <Route component={CreateGame} path="/create-game" />
        <Route component={Welcome} path="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
