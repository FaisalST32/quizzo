import React, { Component } from 'react';
import classes from './results.module.css';
import victoryGif from '../../assets/gifs/lfc_victory.gif';
import { config } from '../../environments/environment.dev';
import axios from 'axios';
// import victoryGif2 from '../../assets/gifs/lfc_victory.gif';

import { IParticipant } from '../../interfaces/IParticipant';
import { Link } from 'react-router-dom';
import ResultsWaiting from './results-waiting/results-waiting.component';

interface IResultsState {
    leaderboard: IParticipant[];
    showLeaderboard: boolean;
    username: string;
    gameId: string;

    gameHasFinished: boolean;
}

class Results extends Component<any, IResultsState> {
    // victoryGifs: string[] = [

    // ]
    constructor(props: any) {
        super(props);
        this.state = {
            leaderboard: [],
            showLeaderboard: false,
            username: '',
            gameId: '',
            gameHasFinished: false
        };
    }

    componentDidMount = async () => {
        const username = this.props.match.params.username;
        const gameId = this.props.match.params.id;
        this.setState({
            username: username,
            gameId: gameId
        });
        this.checkIfGameFinished(gameId);
    };

    checkIfGameFinished = async (roomCode: string) => {
        const gameIsActive = await this.checkGameActive(roomCode);
        if (!gameIsActive) {
            this.setState({
                gameHasFinished: true,
            });
            await this.setLeaderboard(roomCode);
            return;
        }

        const interval = setInterval(async () => {
            if (this.state.gameHasFinished) {
                clearInterval(interval);
                await this.setLeaderboard(roomCode);
            }

            const gameIsActive = await this.checkGameActive(roomCode);
            if (!gameIsActive) {
                clearInterval(interval);
                this.setState({
                    gameHasFinished: true,
                }, () => {
                    this.setLeaderboard(roomCode);
                });
            }
        }, 5000);

    }

    checkGameActive = async (roomCode: string) => {
        const resp = await axios.get(
            `${config.apiUrl}QuizRooms/${roomCode}/IsQuizActive`
        );
        console.log(resp);
        return resp && resp.data === true;
    }

    setLeaderboard = async (roomCode: string) => {
        const leaderboard = await this.getLeaderboard(roomCode);
        this.setState({
            leaderboard: leaderboard
        })

    }

    getLeaderboard = async (gameId: string): Promise<IParticipant[]> => {
        const resp = await axios.get<IParticipant[]>(
            `${config.apiUrl}QuizRooms/${gameId}/GetLeaderboard`
        );
        console.log(resp);
        const leaderboard = resp.data;
        return leaderboard;
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
            `/solution/${this.state.gameId}/${this.state.username}`
        );
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

        const participantScore: number = this.state.leaderboard.find(
            (p) => p.name.toLowerCase() === this.state.username.toLowerCase()
        )?.score as number;

        let resultsActions = (
            <div className={classes.resultsActionArea}>
                <div className={classes.resultsActionButtons}>
                    <button
                        onClick={this.onShowLeaderboard}
                        className="button large-button success-button"
                    >
                        Top Ten
                    </button>
                    <button
                        onClick={this.onShowSolution}
                        className="button large-button danger-button"
                    >
                        Show Solution
                    </button>
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
                                style={{ margin: '20px 10px', textAlign: 'center' }}
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
                    {this.state.gameHasFinished ?
                        <React.Fragment>
                            <div className={classes.resultsHeader}>
                                {winners.length > 1 ? 'And the winners are' : 'And the winner is'}
                                <span>
                                    {winners.map((winner, i) => {
                                        return (
                                            <div key={i}>
                                                <span>{winner.name}</span> <span>({winner.score} pts)</span>
                                            </div>
                                        );
                                    })}
                                </span><br />
                                <img
                                    className={classes.resultsGif}
                                    alt="victory"
                                    src={victoryGif}
                                ></img>
                            </div>
                            <div className={classes.yourScore}>Your score: {participantScore}</div>
                            <div className={classes.resultsActions}>
                                {resultsActions}
                            </div>
                        </React.Fragment>
                        : <ResultsWaiting />}
                </div>
            </div>

        )
    }
}

export default Results;
