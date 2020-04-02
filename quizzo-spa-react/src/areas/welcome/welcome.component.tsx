import React, { Component } from 'react';
import classes from './welcome.module.css';

interface IWelcomeState {
    showJoinBox: boolean
}

class Welcome extends Component<{}, IWelcomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showJoinBox: false
        }
    }

    onCreateGame = () => {

    }

    onShowJoin = () => {
        this.setState({
            showJoinBox: true
        });
    }

    onShowWelcomeButtons = () => {
        this.setState({
            showJoinBox: false
        });
    }
    render() {
        let welcomeActions = (
            <div className={classes.welcomeButtons}>
                <button onClick={this.onCreateGame} className="button large-button success-button">Create a Game</button>
                <button onClick={this.onShowJoin} className="button large-button danger-button">I have an Invite Code</button>
            </div>
        );
        if (this.state.showJoinBox) {
            welcomeActions = (
                <div className={classes.joinGame}>
                    <input className="input large-input" type="text" placeholder="Invite Code" />
                    <button className="button large-button success-button" style={{marginTop: '20px'}}>Join Now</button>
                    <button className="button danger-button" onClick={this.onShowWelcomeButtons} style={{marginTop: '20px'}}>Back</button>
                </div>
            )
        }
        return (
            <div className={classes.welcome}>
                <div className={classes.welcomeContainer}>
                    <div className={classes.welcomeHeader}>Welcome to Quizzo</div>
                    <div className={classes.welcomeActions}>
                        {welcomeActions}
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;