import React, { Component } from 'react';
import classes from './solution.module.css';
import { ISolution } from '../../interfaces/ISolution';
import { config } from '../../environments/environment.dev';
import axios from 'axios';

interface ISolutionState {
    solutions?: ISolution[];
    username: string;
    roomCode: string;
}

class Solution extends Component<any, ISolutionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            solutions: undefined,
            username: '',
            roomCode: '',
        };
    }
    componentDidMount = async () => {
        try {
            this.props.showLoader()
            const roomCode = this.props.match.params.id;
            const username = this.props.match.params.username;
            const solutions = await this.getSolutions(roomCode, username);
            this.setState({
                solutions: solutions,
                username: username,
                roomCode: roomCode,
            });
            this.props.hideLoader();
        } catch (err) {
            this.props.hideLoader();
        }
    };

    onShowResults = () => {
        this.props.history.push(
            `/results/${this.state.roomCode}/${this.state.username}`
        );
    };

    getSolutions = async (
        roomCode: string,
        username: string
    ): Promise<ISolution[]> => {
        try {
            const resp = await axios.get<ISolution[]>(
                `${config.apiUrl}QuizRooms/${roomCode}/${username}/GetSolution`
            );
            console.log(resp);
            const solutions = resp.data;
            return solutions;
        } catch (err) {
            return [];
        }
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
