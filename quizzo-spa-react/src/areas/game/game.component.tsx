import React, { Component } from 'react';
import classes from './game.module.css';
import { mockQuiz } from '../../mock/quiz.mock';
import { IQuiz } from '../../interfaces/IQuiz';
import WaitingArea from './waiting-area/waiting-area.component';
import { IQuestion } from '../../interfaces/IQuestion';
import QuestionArea from './question-area/question-area.component';

type GameState = {
    gameData?: IQuiz,
    currentQuestion?: IQuestion,
    currentTimer: number,
    currentOptionSelected: string,
    gameOver: boolean
}

class Game extends Component<any, GameState> {

    constructor(props: any) {
        super(props);
        this.state = {
            gameData: undefined,
            currentQuestion: undefined,
            currentTimer: 20,
            currentOptionSelected: '',
            gameOver: false
        }
    }
    componentDidMount = () => {
        const gameId = this.props.match.params.id;
        const userName = this.props.match.params.username;
        console.log(gameId);
        console.log(userName);
        const gameData = this.getGameData(gameId, userName);
        // TODO: add logic to select current question based on time elapsed
        this.setState({
            gameData: gameData,
            currentQuestion: gameData.Questions[0],
            currentOptionSelected: '',
            currentTimer: 20
        });
        this.beginTimer();
    }

    getGameData = (gameId: string, userName: string) => {
        //TODO: Fetch quiz from API

        const quizFound: IQuiz = mockQuiz;
        return quizFound;
    }

    beginTimer = () => {
        setInterval(() => {
            if (this.state.currentTimer === 0) {
                this.onNextQuestion();
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
        const currentQuestionIndex: number = this.state.gameData?.Questions.findIndex(q => q.Id === this.state.currentQuestion?.Id) as number;
        if (currentQuestionIndex === this.state.gameData?.Questions.length) {
            this.setState({
                gameOver: true
            })
        }
        this.setState(currState => {
            return {
                currentQuestion: currState.gameData?.Questions[currentQuestionIndex + 1],
                currentTimer: 20,
                currentOptionSelected: ''
            }
        })
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
    render() {
        let gameArea = <WaitingArea />

        if (this.state.gameData?.StartedAtUTC && !this.state.gameOver) {
            gameArea = <QuestionArea timer={this.state.currentTimer}
                question={this.state.currentQuestion}
                selectOption={this.onSelectOption}
                selectedOption={this.state.currentOptionSelected}
                questionNumber={0} />
        }

        if (this.state.gameOver) {
            this.props.history.push('/welcome');
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