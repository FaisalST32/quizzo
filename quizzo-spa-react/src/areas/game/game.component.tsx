import React, { Component } from 'react';
import classes from './game.module.css';
import { IQuiz } from '../../interfaces/IQuiz';
import WaitingArea from './waiting-area/waiting-area.component';
import { IQuestion } from '../../interfaces/IQuestion';
import QuestionArea from './question-area/question-area.component';
import GameOver from './game-over/game-over.component';
import axios from 'axios';
import { config } from '../../environments/environment.dev';

type GameState = {
    gameData?: IQuiz;
    currentQuestion?: IQuestion;
    currentTimer: number;
    currentOptionSelected: string;
    gameOver: boolean;
    username: string;
    gameStarted: boolean;
};

class Game extends Component<any, GameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameData: undefined,
            currentQuestion: undefined,
            currentTimer: 20,
            currentOptionSelected: '',
            gameOver: false,
            username: '',
            gameStarted: false,
        };
    }
    componentDidMount = async () => {
        const gameId = this.props.match.params.id;
        const userName = this.props.match.params.username;
        console.log(gameId);
        console.log(userName);
        const gameData = await this.getGameData(gameId, userName);

        console.log(gameData);
        // TODO: add logic to select current question based on time elapsed
        if (gameData.stoppedAtUtc || !gameData.questions.length) {
            this.setState({
                gameOver: true,
            });
            return;
        }
        const gameStarted = !!gameData.startedAtUtc;
        console.log(gameData.startedAtUtc);

        this.setState({
            gameData: gameData,
            currentQuestion: gameData.questions[0],
            currentOptionSelected: '',
            currentTimer: 20,
            username: userName,
            gameStarted: gameStarted,
        });

        this.checkIfGameStarted(gameId);
        // this.beginTimer();
    };

    getGameData = async (gameId: string, userName: string): Promise<IQuiz> => {
        const resp = await axios.get<{
            quizRoom: IQuiz;
            questions: IQuestion[];
        }>(`${config.apiUrl}quizrooms/${gameId}/${userName}`);
        console.log(resp);

        const quizFound: IQuiz = resp.data.quizRoom;
        quizFound.questions = resp.data.questions;
        return quizFound;
    };

    checkIfGameStarted = async (gameId: string) => {
        if (this.state.gameStarted) {
            this.beginTimer();
            return;
        }
        const interval = setInterval(async () => {
            if (this.state.gameStarted) {
                clearInterval(interval);
                this.beginTimer();
            }

            const resp = await axios.get(
                `${config.apiUrl}QuizRooms/${gameId}/IsQuizActive`
            );
            console.log(resp);
            if (resp && resp.data) {
                clearInterval(interval);
                this.setState({
                    gameStarted: true,
                });
                this.beginTimer();
            }
        }, 5000);
    };

    beginTimer = () => {
        const timer = setInterval(() => {
            if (this.state.currentTimer === 0) {
                this.onNextQuestion();
                clearInterval(timer);
                return;
            }
            this.setState((currState) => {
                return {
                    currentTimer: currState.currentTimer - 1,
                };
            });
        }, 1000);
    };

    onNextQuestion = () => {
        if (!this.state.currentOptionSelected) {
            this.saveResponse(this.state.currentQuestion?.id as string);
        }
        const currentQuestionIndex: number = this.state.gameData?.questions.findIndex(
            (q) => q.id === this.state.currentQuestion?.id
        ) as number;
        if (
            currentQuestionIndex ===
            (this.state.gameData?.questions.length as number) - 1
        ) {
            this.setState({
                gameOver: true,
            });
            return;
        }
        this.setState((currState) => {
            return {
                currentQuestion:
                    currState.gameData?.questions[currentQuestionIndex + 1],
                currentTimer: 20,
                currentOptionSelected: '',
            };
        });
        this.beginTimer();
    };

    onSelectOption = async (questionId: string, optionId: string) => {
        if (this.state.currentOptionSelected) {
            return;
        }

        await this.saveResponse(questionId, optionId);

        this.setState({
            currentOptionSelected: optionId,
        });
    };

    saveResponse = async (questionId: string, optionId?: string) => {
        const body = {
            questionId,
            answerId: optionId,
            timeTaken: 20 - this.state.currentTimer,
        };
        await axios.post(
            `${config.apiUrl}responses/${this.state.username}/postResponse`,
            body
        );
        return;
    };

    onViewResults = () => {
        this.props.history.push(
            `/results/${this.state.gameData?.roomCode}/${this.state.username}`
        );
    };
    render() {
        let gameArea = <WaitingArea />;

        if (this.state.gameStarted && !this.state.gameOver) {
            gameArea = (
                <QuestionArea
                    timer={this.state.currentTimer}
                    question={this.state.currentQuestion}
                    selectOption={this.onSelectOption}
                    selectedOption={this.state.currentOptionSelected}
                    questionNumber={0}
                />
            );
        }

        if (this.state.gameOver) {
            gameArea = <GameOver viewResults={this.onViewResults} />;
        }

        return (
            <div className={classes.game}>
                <div className={classes.gameContainer}>{gameArea}</div>
            </div>
        );
    }
}

export default Game;
