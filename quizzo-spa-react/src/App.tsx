import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Game from './areas/game/game.component';
import CreateGame from './areas/create-game/create-game.component';
import Welcome from './areas/welcome/welcome.component';
import Results from './areas/results/results.component';
import Solution from './areas/solution/solution.component';
import LoadingScreen from './common/loading-screen/loading-screen.component';
import Credits from './common/credits/credits.component';

function App() {
    const [loaderDetails, setLoaderDetails] = useState({
        isShown: false,
        hideContent: false
    });
    const onToggleLoader = (show: boolean, hideContent: boolean = false) => {
        setLoaderDetails({
            isShown: show,
            hideContent: hideContent
        });
    };

    const childProps = {
        showLoader: (hideContent: boolean) => { onToggleLoader(true, hideContent) },
        hideLoader: () => { onToggleLoader(false) }
    }

    return (

        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route exact render={props => <Game {...props} {...childProps} />} path="/game/:id/:username" />
                    <Route render={props => <CreateGame {...props} {...childProps} />} path="/create-game/:roomCode/:adminCode" />
                    <Route render={props => <Results {...props} {...childProps} />} path="/results/:id/:username" />
                    <Route render={props => <Solution {...props} {...childProps} />} path="/solution/:id/:username" />
                    <Route render={props => <Welcome {...props} {...childProps} />} path="/:roomCode" />
                    <Route render={props => <Welcome {...props} {...childProps} />} path="/" />
                </Switch>
            </BrowserRouter>
            <LoadingScreen show={loaderDetails.isShown} hideContent={loaderDetails.hideContent} />
            <Credits />
        </React.Fragment>
    );
}

export default App;
