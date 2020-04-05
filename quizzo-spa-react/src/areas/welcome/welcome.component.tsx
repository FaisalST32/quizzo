import React, { Component } from 'react';
import classes from './welcome.module.css';
import axios from 'axios';
import { config } from '../../environments/environment.dev';
import { IParticipant } from '../../interfaces/IParticipant';
import { IQuiz } from '../../interfaces/IQuiz';

interface IWelcomeState {
    showJoinBox: boolean;
    username: string;
    inviteCode: string;
    errorMessage: string;
}

class Welcome extends Component<any, IWelcomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showJoinBox: false,
            inviteCode: '',
            username: '',
            errorMessage: '',
        };
    }

    onCreateGame = async () => {
        try {
            this.props.showLoader();
            const roomCode = await this.createNewQuiz();
            this.props.hideLoader();
            this.props.history.push(`/create-game/${roomCode}`);
        } catch (err) {
            this.props.hideLoader();
        }
    };

    createNewQuiz = async (): Promise<string> => {
        const resp = await axios.post<IQuiz>(
            `${config.apiUrl}quizrooms/create`
        );
        console.log(resp);
        const roomCode: string = resp.data.roomCode;
        return roomCode;
    };

    onShowJoin = () => {
        this.setState({
            showJoinBox: true,
        });
    };

    onShowWelcomeButtons = () => {
        this.setState({
            showJoinBox: false,
        });
    };

    onChangeInviteCode = (e: any) => {
        this.setState({
            inviteCode: e.target.value.trim(),
        });
    };

    onChangeUserName = (e: any) => {
        this.setState({
            username: e.target.value.trim(),
        });
    };

    onJoinRoom = async () => {
        if (!this.state.username || !this.state.inviteCode) {
            this.showError('Please enter a valid Invite Code and Name');
            return;
        }

        try {
            this.props.showLoader();
            const roomExists = await this.checkRoomExists(
                this.state.inviteCode
            );
            if (!roomExists) {
                this.props.hideLoader();
                this.showError('Invite Code is invalid');
                return;
            }

            const resp = await this.addParticipantToGame(
                this.state.username,
                this.state.inviteCode
            );
            if (resp.data === 'exists') {
                this.showError('Username already taken');
                this.props.hideLoader();
                return;
            }

            this.props.history.push(
                `/game/${this.state.inviteCode}/${this.state.username}`
            );
            this.props.hideLoader();
        } catch (err) {
            this.props.hideLoader();
        }
    };

    addParticipantToGame = async (username: string, roomCode: string) => {
        const participant: IParticipant = { name: username, score: 0, rank: 0 };
        return await axios.post(
            `${config.apiUrl}participants/${roomCode}/PostParticipant`,
            participant
        );
    };

    checkRoomExists = async (roomCode: string): Promise<boolean> => {
        if (!roomCode) return false;
        const roomExists: boolean = (
            await axios.get<boolean>(
                `${config.apiUrl}quizrooms/roomexists/${roomCode}`
            )
        ).data;
        return roomExists;
    };

    showError = (message: string) => {
        this.setState({
            errorMessage: message,
        });
    };
    render() {
        let welcomeActions = (
            <div className={classes.welcomeButtons}>
                <button
                    onClick={this.onCreateGame}
                    className="button large-button success-button"
                >
                    Create a Game
                </button>
                <button
                    onClick={this.onShowJoin}
                    className="button large-button danger-button"
                >
                    I have an Invite Code
                </button>
            </div>
        );
        if (this.state.showJoinBox) {
            welcomeActions = (
                <div className={classes.joinGame}>
                    <input
                        className="input large-input"
                        type="text"
                        value={this.state.inviteCode}
                        onChange={this.onChangeInviteCode}
                        placeholder="Invite Code"
                    />
                    <input
                        className="input large-input"
                        type="text"
                        value={this.state.username}
                        onChange={this.onChangeUserName}
                        placeholder="Your Name"
                        style={{ marginTop: '20px' }}
                    />
                    <button
                        className="button large-button success-button"
                        style={{ marginTop: '20px' }}
                        onClick={this.onJoinRoom}
                    >
                        Join Now
                    </button>
                    <button
                        className="button clear-button"
                        onClick={this.onShowWelcomeButtons}
                        style={{ marginTop: '20px' }}
                    >
                        Back
                    </button>
                </div>
            );
        }
        return (
            <div className={classes.welcome}>
                <div className={classes.welcomeContainer}>
                    <div className={classes.welcomeHeader}>
                        Welcome to <span>Quizzo</span>
                    </div>
                    <div className={classes.error}>
                        {this.state.errorMessage}
                    </div>
                    <div className={classes.welcomeActions}>
                        {welcomeActions}
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;
