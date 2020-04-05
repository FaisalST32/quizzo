import React, { Component } from 'react';
import classes from './solution.module.css';
import { ISolution } from '../../interfaces/ISolution';
import { config } from '../../environments/environment.dev';
import axios from 'axios';

interface ISolutionState {
    solutions?: ISolution[];
    username: string;
    gameId: string;
}

class Solution extends Component<any, ISolutionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            solutions: undefined,
            username: '',
            gameId: '',
        };
    }
    componentDidMount = async () => {
        const gameId = this.props.match.params.id;
        const username = this.props.match.params.username;
        const solutions = await this.getSolutions(gameId, username);
        this.setState({
            solutions: solutions,
            username: username,
            gameId: gameId,
        });
    };

    onShowResults = () => {
        this.props.history.push(
            `/results/${this.state.gameId}/${this.state.username}`
        );
    };

    getSolutions = async (
        gameId: string,
        username: string
    ): Promise<ISolution[]> => {
        const resp = await axios.get<ISolution[]>(
            `${config.apiUrl}QuizRooms/${gameId}/${username}/GetSolution`
        );
        console.log(resp);
        const solutions = resp.data;
        return solutions;
    };

    render() {
        const totalScore = this.state.solutions?.reduce(
            (prev, next) => prev + next.score,
            0
        );

        return (
            <div className={classes.solution}>
                <div className={classes.solutionContainer}>
                    <div className={classes.solutionHeader}>Solution</div>
                    {this.state.solutions?.map((solution, i) => {
                        return (
                            <div key={i} className={classes.solutionContent}>
                                <div>
                                    Question:{' '}
                                    <span className={classes.solutionQuestion}>
                                        {solution.questionText}
                                    </span>
                                </div>
                                <div>
                                    Correct Answer: {solution.correctAnswerText}
                                </div>
                                <div>
                                    Your Answer:{' '}
                                    <span
                                        className={
                                            solution.correctAnswerText ===
                                            solution.selectedAnswerText
                                                ? classes.solutionCorrect
                                                : classes.solutionWrong
                                        }
                                    >
                                        {solution.selectedAnswerText}
                                    </span>
                                </div>
                                <div>Your Score: {solution.score}</div>
                            </div>
                        );
                    })}
                    <div className={classes.solutionTotalScore}>
                        Your Total Score: {totalScore}
                    </div>
                    <div className={classes.solutionButtons}>
                        <button
                            className="button clear-button"
                            onClick={this.onShowResults}
                            style={{ marginTop: '20px', marginBottom: '20px' }}
                        >
                            Back to Results
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Solution;
