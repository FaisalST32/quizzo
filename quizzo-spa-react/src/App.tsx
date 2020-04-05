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
    const onToggleLoader = (show: boolean) => {
        setLoader(show);
    };

    const childProps = {
        showLoader: () => {onToggleLoader(true)},
        hideLoader: () => {onToggleLoader(false)}
    }
    return (

        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route exact render={props => <Game {...props} {...childProps} />} path="/game/:id/:username" />
                    <Route render={props => <CreateGame {...props} {...childProps} />} path="/create-game/:roomCode" />
                    <Route render={props => <Results {...props} {...childProps} />} path="/results/:id/:username" />
                    <Route render={props => <Solution {...props} {...childProps} />} path="/solution/:id/:username" />
                    <Route render={props => <Welcome {...props} {...childProps} />} path="/" />
                </Switch>
            </BrowserRouter>
            <LoadingScreen show={showLoader} />
        </React.Fragment>

    );
}

export default App;
