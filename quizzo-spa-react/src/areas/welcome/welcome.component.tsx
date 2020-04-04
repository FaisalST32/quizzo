import React, { Component } from 'react';
import classes from './welcome.module.css';

interface IWelcomeState {
    showJoinBox: boolean,
    userName: string;
    inviteCode: string;
}

class Welcome extends Component<any, IWelcomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showJoinBox: false,
            inviteCode: '',
            userName: ''
        }
    }

    onCreateGame = () => {
        this.props.history.push('/create-game');
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

    onChangeInviteCode = (e: any) => {
        this.setState({
            inviteCode: e.target.value
        })
    }

    onChangeUserName = (e: any) => {
        this.setState({
            userName: e.target.value
        })
    }

    onJoinRoom = () => {    
        //TODO: check if room exists
        //TODO: addplayer and go to game

        this.props.history.push(`/game/${this.state.inviteCode}/${this.state.userName}`);
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
                    <input className="input large-input" type="text" value={this.state.inviteCode} onChange={this.onChangeInviteCode} placeholder="Invite Code" />
                    <input className="input large-input" type="text" value={this.state.userName} onChange={this.onChangeUserName} placeholder="Your Name" style={{ marginTop: '20px' }} />
                    <button className="button large-button success-button" style={{ marginTop: '20px' }} onClick={this.onJoinRoom}>Join Now</button>
                    <button className="button clear-button" onClick={this.onShowWelcomeButtons} style={{ marginTop: '20px' }}>Back</button>
                </div>
            )
        }
        return (
            <div className={classes.welcome}>
                <div className={classes.welcomeContainer}>
                    <div className={classes.welcomeHeader}>Welcome to <span>Quizzo</span></div>
                    <div className={classes.welcomeActions}>
                        {welcomeActions}
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;