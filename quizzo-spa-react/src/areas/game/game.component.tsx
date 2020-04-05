import React, { Component } from 'react';
import classes from './game.module.css';
import { mockQuiz } from '../../mock/quiz.mock';
import { IQuiz } from '../../interfaces/IQuiz';
import WaitingArea from './waiting-area/waiting-area.component';
import { IQuestion } from '../../interfaces/IQuestion';
import QuestionArea from './question-area/question-area.component';
import GameOver from './game-over/game-over.component';

type GameState = {
    gameData?: IQuiz,
    currentQuestion?: IQuestion,
    currentTimer: number,
    currentOptionSelected: string,
    gameOver: boolean,
    username: string
}

class Game extends Component<any, GameState> {

    constructor(props: any) {
        super(props);
        this.state = {
            gameData: undefined,
            currentQuestion: undefined,
            currentTimer: 20,
            currentOptionSelected: '',
            gameOver: false,
            username: ''
        }
    }
    componentDidMount = () => {
        const gameId = this.props.match.params.id;
        const userName = this.props.match.params.username;
        console.log(gameId);
        console.log(userName);
        const gameData = this.getGameData(gameId, userName);
        // TODO: add logic to select current question based on time elapsed
        if (gameData.stoppedAtUTC) {
            this.setState({
                gameOver: true
            })
            return;
        }
        this.setState({
            gameData: gameData,
            currentQuestion: gameData.questions[0],
            currentOptionSelected: '',
            currentTimer: 20,
            username: userName
        });
        this.beginTimer();
    }

    getGameData = (gameId: string, userName: string) => {
        //TODO: Fetch quiz from API

        const quizFound: IQuiz = mockQuiz;
        return quizFound;
    }

    beginTimer = () => {
        const timer = setInterval(() => {
            if (this.state.currentTimer === 0) {
                this.onNextQuestion();
                clearInterval(timer);
                return;
            }
            this.setState(currState => {
                return {
                    currentTimer: currState.currentTimer - 1
                }
            })
        }, 1000)
    }

    onNextQuestion = () => {
        const currentQuestionIndex: number = this.state.gameData?.questions.findIndex(q => q.id === this.state.currentQuestion?.id) as number;
        if (currentQuestionIndex === this.state.gameData?.questions.length as number - 1) {
            this.setState({
                gameOver: true
            });
            return;
        }
        this.setState(currState => {
            return {
                currentQuestion: currState.gameData?.questions[currentQuestionIndex + 1],
                currentTimer: 20,
                currentOptionSelected: ''
            }
        })
        this.beginTimer();
    }

    onSelectOption = (questionId: string, optionId: string) => {
        if (this.state.currentOptionSelected) {
            return;
        }
        //TODO: Api call
        this.setState({
            currentOptionSelected: optionId
        })
    }

    onViewResults = () => {
        this.props.history.push(`/results/${this.state.gameData?.roomCode}/${this.state.username}`)
    }
    render() {
        let gameArea = <WaitingArea />

        if (this.state.gameData?.startedAtUTC && !this.state.gameOver) {
            gameArea = <QuestionArea timer={this.state.currentTimer}
                question={this.state.currentQuestion}
                selectOption={this.onSelectOption}
                selectedOption={this.state.currentOptionSelected}
                questionNumber={0} />
        }

        if (this.state.gameOver) {
            gameArea = <GameOver viewResults={this.onViewResults} />
        }

        return (
            <div className={classes.game}>
                <div className={classes.gameContainer}>
                    {gameArea}
                </div>
            </div>
        )
    }
}

export default Game;