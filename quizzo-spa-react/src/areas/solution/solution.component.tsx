import React, { Component } from 'react';
import classes from './solution.module.css';
import { ISolution } from '../../interfaces/ISolution';
import { mockSolutions } from '../../mock/solution.mock';

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
    componentDidMount = () => {
        const gameId = this.props.match.params.id;
        const username = this.props.match.params.username;
        const solutions = this.getSolutions(gameId, username);
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

    getSolutions = (gameId: string, userName: string) => {
        //TODO: Fetch solutions from API

        const solutions: ISolution[] = mockSolutions;
        return solutions;
    };

    render() {
        const totalScore = this.state.solutions?.reduce(
            (prev, next) => prev + next.Score,
            0
        );

        return (
            <div className={classes.solution}>
                <div className={classes.solutionContainer}>
                    <div className={classes.solutionHeader}>Solution</div>
                    {this.state.solutions?.map((solution, i) => {
                        return (
                            <div className={classes.solutionContent}>
                                <div>
                                    Question:{' '}
                                    <span className={classes.solutionQuestion}>
                                        {solution.QuestionText}
                                    </span>
                                </div>
                                <div>
                                    Correct Answer: {solution.CorrectAnswerText}
                                </div>
                                <div>
                                    Your Answer:{' '}
                                    <span
                                        className={
                                            solution.CorrectAnswerText ===
                                            solution.SelectedAnswerText
                                                ? classes.solutionCorrect
                                                : classes.solutionWrong
                                        }
                                    >
                                        {solution.SelectedAnswerText}
                                    </span>
                                </div>
                                <div>Your Score: {solution.Score}</div>
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
