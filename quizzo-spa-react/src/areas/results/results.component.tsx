import React, { Component } from 'react';
import classes from './results.module.css';
import victoryGif from '../../assets/gifs/lfc_victory.gif';
import { config } from '../../environments/environment.dev';
import axios from 'axios';
import { IParticipant } from '../../interfaces/IParticipant';
import { Link } from 'react-router-dom';
import ResultsWaiting from './results-waiting/results-waiting.component';

interface IResultsState {
    leaderboard: IParticipant[];
    showLeaderboard: boolean;
    username: string;
    roomCode: string;
    gameHasFinished: boolean;
    participant: IParticipant | null;
}

class Results extends Component<any, IResultsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            leaderboard: [],
            showLeaderboard: false,
            username: '',
            roomCode: '',
            gameHasFinished: false,
            participant: null,
        };
    }

    componentDidMount = async () => {
        const username = this.props.match.params.username;
        const roomCode = this.props.match.params.id;
        this.setState({
            username: username,
            roomCode: roomCode,
        });
        this.checkIfGameFinished(roomCode, username);
    };

    checkIfGameFinished = async (roomCode: string, username: string) => {
        const gameIsActive = await this.checkGameActive(roomCode);
        if (!gameIsActive) {
            this.setState({
                gameHasFinished: true,
            });
            await this.setLeaderboard(roomCode, username);
            return;
        }

        const interval = setInterval(async () => {
            if (this.state.gameHasFinished) {
                clearInterval(interval);
                await this.setLeaderboard(roomCode, username);
            }

            const gameIsActive = await this.checkGameActive(roomCode);
            if (!gameIsActive) {
                clearInterval(interval);
                this.setState(
                    {
                        gameHasFinished: true,
                    },
                    () => {
                        this.setLeaderboard(roomCode, username);
                    }
                );
            }
        }, 5000);
    };

    checkGameActive = async (roomCode: string) => {
        const resp = await axios.get(
            `${config.apiUrl}QuizRooms/${roomCode}/IsQuizActive`
        );
        console.log(resp);
        return resp && resp.data === true;
    };

    setLeaderboard = async (roomCode: string, username: string) => {
        this.props.showLoader(true);
        try {
            const leaderboard = await this.getLeaderboard(roomCode);
            const participant = await this.getParticipantResult(
                roomCode,
                username
            );
            this.setState({
                leaderboard: leaderboard,
                participant: participant,
            });
            this.props.hideLoader();
        } finally {
            this.props.hideLoader();
        }
    };

    getLeaderboard = async (roomCode: string): Promise<IParticipant[]> => {
        const resp = await axios.get<IParticipant[]>(
            `${config.apiUrl}QuizRooms/${roomCode}/GetLeaderboard`
        );
        console.log(resp);
        const leaderboard = resp.data;
        return leaderboard;
    };

    getParticipantResult = async (
        roomCode: string,
        username: string
    ): Promise<IParticipant | null> => {
        if (username !== 'admin') {
            const resp = await axios.get<IParticipant>(
                `${config.apiUrl}QuizRooms/${roomCode}/${username}/GetParticipantResult`
            );
            console.log(resp);
            const participant = resp.data;
            return participant;
        } else {
            return null;
        }
    };

    onShowResults = () => {
        this.setState({
            showLeaderboard: false,
        });
    };

    onShowLeaderboard = () => {
        this.setState({
            showLeaderboard: true,
        });
    };

    onShowSolution = () => {
        this.props.history.push(
            `/solution/${this.state.roomCode}/${this.state.username}`
        );
    };

    onExitGame = () => {
        this.props.history.push(`/`);
    };

    // getVictoryGif: string =

    render() {
        const leaderBoard = this.state.leaderboard.map((item, key) => (
            <tr key={item.name} data-rank={item.rank}>
                <td>{item.rank}</td>
                <td>{item.name}</td>
                <td>{item.score} pts</td>
            </tr>
        ));

        const winners: IParticipant[] = this.state.leaderboard.filter(
            (participant) => participant.rank === 1
        );

        let resultsActions = (
            <div className={classes.resultsActionArea}>
                <div className={classes.resultsActionButtons}>
                    <button
                        onClick={this.onShowLeaderboard}
                        className="button large-button success-button"
                    >
                        Top Ten
                    </button>
                    {this.state.username !== 'admin' && (
                        <button
                            onClick={this.onShowSolution}
                            className="button large-button danger-button"
                        >
                            Show Solution
                        </button>
                    )}
                    {this.state.username === 'admin' && (
                        <button
                            onClick={this.onExitGame}
                            className="button large-button danger-button"
                        >
                            Exit Game
                        </button>
                    )}
                </div>
            </div>
        );

        if (this.state.showLeaderboard) {
            resultsActions = (
                <div className={classes.resultsActionArea}>
                    <table className={classes.resultsListTable}>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Participant Name</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>{leaderBoard}</tbody>
                    </table>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            className="button primary-button"
                            onClick={this.onShowResults}
                            style={{ margin: '20px 10px', textAlign: 'center' }}
                        >
                            Back
                        </button>
                        <Link to="/">
                            <button
                                className="button success-button"
                                style={{
                                    margin: '20px 10px',
                                    textAlign: 'center',
                                }}
                            >
                                Go Home
                            </button>
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className={classes.results}>
                <div className={classes.resultsContainer}>
                    {this.state.gameHasFinished ? (
                        <React.Fragment>
                            <div className={classes.resultsHeader}>
                                {winners.length > 1
                                    ? 'And the winners are'
                                    : 'And the winner is'}
                                <span>
                                    {winners.map((winner, i) => {
                                        return (
                                            <div key={i}>
                                                <span>{winner.name}</span>{' '}
                                                <span>
                                                    ({winner.score} pts)
                                                </span>
                                            </div>
                                        );
                                    })}
                                </span>
                                <img
                                    className={classes.resultsGif}
                                    alt="victory"
                                    src={victoryGif}
                                ></img>
                            </div>
                            {this.state.username !== 'admin' && (
                                <div className={classes.yourScore}>
                                    Your score: {this.state.participant?.score}{' '}
                                    &nbsp;&nbsp; Your rank:{' '}
                                    {this.state.participant?.rank}
                                </div>
                            )}
                            <div className={classes.resultsActions}>
                                {resultsActions}
                            </div>
                        </React.Fragment>
                    ) : (
                        <ResultsWaiting />
                    )}
                </div>
            </div>
        );
    }
}

export default Results;
