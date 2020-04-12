import React, { Component } from 'react';
import classes from './create-game.module.css';
import { IQuestion } from '../../interfaces/IQuestion';
import AddQuestionForm from './add-question-form/add-question-form.component';
import AddedQuestion from './added-question/added-question.component';
import { IAnswer } from '../../interfaces/IAnswer';
import { config } from '../../environments/environment.dev';
import axios from 'axios';
import CreateGameInfo from './create-game-info/create-game-info.component';
import FinishGameInfo from './finish-create-info/finish-game-info.component';
import { IQuiz } from '../../interfaces/IQuiz';

interface ICreateGameState {
    quizData: IQuiz;
    questions: IQuestion[];
    questionToAdd: IQuestion;
    addingQuestions: boolean;
}

class CreateGame extends Component<any, ICreateGameState> {
    emptyQuestion = {
        questionText: '',
        answers: [
            {
                answerText: '',
                isCorrect: false,
            },
            {
                answerText: '',
                isCorrect: false,
            },
            {
                answerText: '',
                isCorrect: false,
            },
            {
                answerText: '',
                isCorrect: false,
            },
        ],
    };
    constructor(props: any) {
        super(props);
        this.state = {
            quizData: {
                adminCode: 0,
                roomCode: '',
                isReady: false,
                startedAtUtc: undefined,
                stoppedAtUtc: undefined,
            },
            questions: [],
            questionToAdd: this.emptyQuestion,
            addingQuestions: false,
        };
    }

    componentDidMount = async () => {
        this.props.showLoader(true);
        try {
            const roomCode = this.props.match.params.roomCode;
            const adminCode = this.props.match.params.adminCode;
            const [questions, quizData] = await this.getGameData(
                roomCode,
                adminCode
            );

            if (quizData.stoppedAtUtc) {
                this.props.history.push(
                    `results/${this.state.quizData.roomCode}/admin`
                );
                return;
            }

            this.setState({
                quizData: quizData,
                questions: questions,
                addingQuestions: questions?.length > 0,
            });
            this.props.hideLoader();
        } catch (err) {
            this.props.hideLoader();
            this.props.history.replace('/');
        }
    };

    getGameData = async (
        roomCode: string,
        adminCode: number
    ): Promise<[IQuestion[], IQuiz]> => {
        const resp = await axios.get<{
            questions: IQuestion[];
            quizRoom: IQuiz;
        }>(
            `${config.apiUrl}quizrooms/GetQuizRoomForAdmin/${roomCode}/${adminCode}`
        );
        console.log(resp);
        const questions = resp.data.questions;
        const quizData = resp.data.quizRoom;
        return [questions, quizData];
    };

    onChangeQuestion = (newValue: string) => {
        let questionToAdd = { ...this.state.questionToAdd };
        questionToAdd.questionText = newValue;
        this.setState({
            questionToAdd: questionToAdd,
        });
    };

    onChangeOption = (newValue: string, optionIndex: number) => {
        let questionToAdd = { ...this.state.questionToAdd };
        let questionAnswers = [...questionToAdd.answers];
        let questionOption = { ...questionAnswers[optionIndex] };
        questionOption.answerText = newValue;
        questionAnswers[optionIndex] = questionOption;
        questionToAdd.answers = questionAnswers;
        this.setState({
            questionToAdd: questionToAdd,
        });
    };

    onSetCorrectOption = (optionIndex: number) => {
        let questionToAdd = { ...this.state.questionToAdd };
        let questionAnswers: IAnswer[] = [...questionToAdd.answers].map(
            (answer, i) => {
                return {
                    answerText: answer.answerText,
                    isCorrect: optionIndex === i,
                };
            }
        );

        questionToAdd.answers = questionAnswers;
        this.setState({
            questionToAdd: questionToAdd,
        });
    };

    onAddQuestion = async () => {
        try {
            const newQuestion: IQuestion = { ...this.state.questionToAdd };
            const questionIsValid: boolean = this.validateQuestion(newQuestion);
            if (!questionIsValid) return;

            this.props.showLoader();
            const questionId: string = await this.addQuestion(
                newQuestion,
                this.state.quizData.roomCode
            );
            newQuestion.id = questionId;

            const questions = [...this.state.questions];
            questions.push(newQuestion);

            this.setState({
                questions: questions,
                questionToAdd: this.emptyQuestion,
            });
            this.props.hideLoader();
        } catch (err) {
            this.props.hideLoader();
        }
    };

    addQuestion = async (
        question: IQuestion,
        roomCode: string
    ): Promise<string> => {
        const resp = await axios.post<IQuestion>(
            `${config.apiUrl}questions/${roomCode}/PostQuestion`,
            question
        );
        console.log(resp);
        return resp.data.id as string;
    };

    validateQuestion = (question: IQuestion) => {
        if (!question || !question.questionText.trim()) return false;

        if (
            !question.answers.every(
                (answer) => answer.answerText && answer.answerText.trim()
            )
        )
            return false;

        if (!question.answers.some((answer) => answer.isCorrect)) return false;

        return true;
    };

    onFinish = async () => {
        if (this.state.questions.length === 0) return;

        this.props.showLoader();
        try {
            await this.onAddQuestion();
            await this.readyQuiz();
            this.props.hideLoader();
            this.showFinishScreen();
        } catch (err) {
            this.props.hideLoader();
        }
    };

    onStartAddingQuestions = () => {
        this.setState({
            addingQuestions: true,
        });
    };

    showFinishScreen = () => {
        const updatedQuizData = { ...this.state.quizData };
        this.setState({
            quizData: {
                ...updatedQuizData,
                isReady: true,
            },
        });
    };

    onStartGame = async () => {
        if (this.state.quizData.startedAtUtc) return;

        this.props.showLoader();

        try {
            await axios.post(
                `${config.apiUrl}quizrooms/${this.state.quizData.roomCode}/startquiz`
            );
            const quizData = { ...this.state.quizData };
            quizData.startedAtUtc = new Date(new Date().toUTCString());
            this.setState({
                quizData: quizData,
            });
            this.props.hideLoader();
        } catch (err) {
            this.props.hideLoader();
        }
    };

    onStopGame = async () => {
        if (this.state.quizData.stoppedAtUtc) {
            return;
        }

        this.props.showLoader();

        try {
            await axios.post(
                `${config.apiUrl}quizrooms/${this.state.quizData.roomCode}/stopquiz`
            );
            const quizData = { ...this.state.quizData };
            quizData.stoppedAtUtc = new Date(new Date().toUTCString());
            this.setState(
                {
                    quizData: quizData,
                },
                () => {
                    this.props.hideLoader();
                    this.props.history.push(
                        `/results/${this.state.quizData.roomCode}/admin`
                    );
                }
            );
        } catch (err) {
            this.props.hideLoader();
        }
    };

    readyQuiz = async () => {
        if (this.state.quizData.isReady) return;
        await axios.post(
            `${config.apiUrl}quizrooms/${this.state.quizData.roomCode}/readyquiz`
        );
        const quizData = { ...this.state.quizData };
        quizData.isReady = true;
        this.setState({
            quizData: quizData,
        });
    };

    render() {
        let createGameArea = (
            <CreateGameInfo
                roomCode={this.state.quizData.roomCode}
                startAddingQuestions={this.onStartAddingQuestions}
            />
        );

        if (this.state.addingQuestions && !this.state.quizData.isReady) {
            let addedQuestions = null;
            if (this.state.questions && this.state.questions.length > 0) {
                addedQuestions = this.state.questions.map((question, i) => {
                    return (
                        <AddedQuestion
                            key={question.id ? question.id : i}
                            question={question}
                            questionNumber={i + 1}
                        />
                    );
                });
            }
            createGameArea = (
                <React.Fragment>
                    <div className={classes.createGameHeader}>
                        Room Code: {this.state.quizData.roomCode}
                        <button
                            onClick={this.onFinish}
                            className={[
                                classes.finishButton,
                                'button clear-button large-button',
                            ].join(' ')}
                        >
                            Finish
                        </button>
                    </div>
                    <div className={classes.createGameContent}>
                        <AddQuestionForm
                            question={this.state.questionToAdd}
                            questionChange={this.onChangeQuestion}
                            optionChange={this.onChangeOption}
                            setCorrectOption={this.onSetCorrectOption}
                        />
                        <div className={classes.addQuestion}>
                            <button
                                className="button clear-button"
                                onClick={this.onAddQuestion}
                            >
                                + Add Question
                            </button>
                        </div>
                        {addedQuestions}
                    </div>
                </React.Fragment>
            );
        }

        if (this.state.quizData.isReady) {
            createGameArea = (
                <FinishGameInfo
                    adminCode={this.state.quizData.adminCode as number}
                    roomCode={this.state.quizData.roomCode}
                    startGame={this.onStartGame}
                    stopGame={this.onStopGame}
                    hasGameStarted={!!this.state.quizData.startedAtUtc}
                />
            );
        }

        return (
            <div className={classes.createGame}>
                <div className={classes.createGameContainer}>
                    {createGameArea}
                </div>
            </div>
        );
    }
}

export default CreateGame;
