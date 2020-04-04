import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Game from './areas/game/game.component';
import CreateGame from './areas/create-game/create-game.component';
import Welcome from './areas/welcome/welcome.component';
import Results from './areas/results/results.component';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact component={Game} path="/game/:id/:username" />
        <Route component={CreateGame} path="/create-game" />
        <Route component={Results} path="/results/:id/:username" />
        <Route component={Welcome} path="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
