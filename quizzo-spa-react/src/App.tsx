import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Game from './areas/game/game.component';
import CreateGame from './areas/create-game/create-game.component';
import Welcome from './areas/welcome/welcome.component';
import Results from './areas/results/results.component';
import Solution from './areas/solution/solution.component';
import LoadingScreen from './common/loading-screen/loading-screen.component';

function App() {
    const [showLoader, setLoader] = useState(false);
    const onToggleLoader = () => {
        setLoader(!showLoader);
    };
    return (

        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route exact render={props => <Game {...props} toggleLoader={onToggleLoader} />} path="/game/:id/:username" />
                    <Route render={props => <CreateGame {...props} toggleLoader={onToggleLoader} />} path="/create-game/:roomCode" />
                    <Route render={props => <Results {...props} toggleLoader={onToggleLoader} />} path="/results/:id/:username" />
                    <Route render={props => <Solution {...props} toggleLoader={onToggleLoader} />} path="/solution/:id/:username" />
                    <Route render={props => <Welcome {...props} toggleLoader={onToggleLoader} />} path="/" />
                </Switch>
            </BrowserRouter>
            <LoadingScreen show={showLoader} />
        </React.Fragment>

    );
}

export default App;
