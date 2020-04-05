import React, { Component } from 'react';
import classes from './results.module.css';
import victoryGif from '../../assets/gifs/lfc_victory.gif';

import { IParticipant } from '../../interfaces/IParticipant';

interface IResultsState {
    leaderboard: IParticipant[];
    showLeaderboard: boolean;
    userName: string;
    inviteCode: string;
}

class Results extends Component<any, IResultsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            leaderboard: [
                { Id: '1', Name: 'Faisal', Score: 100 },
                { Id: '2', Name: 'Krishna', Score: 90 },
                { Id: '3', Name: 'Panda', Score: 80 },
                { Id: '4', Name: 'Koala', Score: 70 },
            ],
            showLeaderboard: false,
            userName: '',
            inviteCode: '',
        };
    }

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
            `/solution/${this.state.inviteCode}/${this.state.userName}`
        );
    };

    render() {
        const items = this.state.leaderboard.map((item, key) => (
            <tr>
                <td>{item.Name}</td>
                <td>{item.Score}</td>
            </tr>
        ));
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
                    <table className={classes.resultsList}>{items}</table>
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
        const winner: IParticipant = this.state.leaderboard[0];
        const participantScore: number = 50;
        return (
            <div className={classes.results}>
                <div className={classes.resultsContainer}>
                    <div className={classes.resultsHeader}>
                        And the winner is
                        <span>
                            {winner.Name} ({winner.Score} pts)
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
