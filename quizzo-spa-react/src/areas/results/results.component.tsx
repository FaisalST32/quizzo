import React, { Component } from 'react';
import classes from './results.module.css';
import victoryGif from '../../assets/gifs/lfc_victory.gif';
import { config } from '../../environments/environment.dev';
import axios from 'axios';
// import victoryGif2 from '../../assets/gifs/lfc_victory.gif';

import { IParticipant } from '../../interfaces/IParticipant';

interface IResultsState {
    leaderboard: IParticipant[];
    showLeaderboard: boolean;
    username: string;
    gameId: string;
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
        };
    }

    componentDidMount = async () => {
        const username = this.props.match.params.username;
        const gameId = this.props.match.params.id;
        const leaderboard = await this.getLeaderboard(gameId);
        this.setState({
            username: username,
            gameId: gameId,
            leaderboard: leaderboard,
        });
    };

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
        const items = this.state.leaderboard.map((item, key) => (
            <tr key={item.name}>
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
            <div className={classes.resultsButtons}>
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
        );

        if (this.state.showLeaderboard) {
            resultsActions = (
                <div className={classes.resultsButtons}>
                    <table className={classes.resultsList}>
                        <thead>{items}</thead>
                    </table>
                    <button
                        className="button clear-button"
                        onClick={this.onShowResults}
                        style={{ marginTop: '20px' }}
                    >
                        Back
                    </button>
                </div>
            );
        }

        return (
            <div className={classes.results}>
                <div className={classes.resultsContainer}>
                    <div className={classes.resultsHeader}>
                        And the winner is
                        <span>
                            {winners.map((winner, i) => {
                                return (
                                    <div key={i}>
                                        <span>{winner.name}</span>
                                        <span>({winner.score} pts)</span>
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
                    <div>Your score: {participantScore}</div>
                    <div className={classes.resultsActions}>
                        {resultsActions}
                    </div>
                </div>
            </div>
        );
    }
}

export default Results;
