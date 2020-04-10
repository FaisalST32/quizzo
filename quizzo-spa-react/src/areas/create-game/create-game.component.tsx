import React, { Component } from 'react';
import classes from './create-game.module.css';
import { IQuestion } from '../../interfaces/IQuestion';
import AddQuestionForm from './add-question-form/add-question-form.component';
import AddedQuestion from './added-question/added-question.component';
import { IAnswer } from '../../interfaces/IAnswer';
import { config } from '../../environments/environment.dev';
import axios from 'axios';

interface ICreateGameState {
    roomCode: string;
    questions: IQuestion[];
    questionToAdd: IQuestion
}

class CreateGame extends Component<any, ICreateGameState> {
    emptyQuestion = {
        questionText: '',
        answers: [
            {
                answerText: '',
                isCorrect: false
            },
            {
                answerText: '',
                isCorrect: false
            },
            {
                answerText: '',
                isCorrect: false
            },
            {
                answerText: '',
                isCorrect: false
            },
        ]
    }
    constructor(props: any) {
        super(props);
        this.state = {
            roomCode: '00000',
            questions: [],
            questionToAdd: this.emptyQuestion
        }
    }

    componentDidMount = async () => {
        const roomCode = this.props.match.params.roomCode;
        const questions = await this.getGameQuestions(roomCode);
        this.setState({
            roomCode: roomCode,
            questions: questions
        })
    }

    getGameQuestions = async (roomCode: string): Promise<IQuestion[]> => {
        const resp = await axios.get<IQuestion[]>(`${config.apiUrl}Questions/GetQuestionsByQuizRoom/${roomCode}`);
        console.log(resp);
        const questions = resp.data;
        return questions;
    }



    onChangeQuestion = (newValue: string) => {
        let questionToAdd = { ...this.state.questionToAdd };
        questionToAdd.questionText = newValue;
        this.setState({
            questionToAdd: questionToAdd
        })
    }

    onChangeOption = (newValue: string, optionIndex: number) => {
        let questionToAdd = { ...this.state.questionToAdd };
        let questionAnswers = [...questionToAdd.answers];
        let questionOption = { ...questionAnswers[optionIndex] };
        questionOption.answerText = newValue;
        questionAnswers[optionIndex] = questionOption;
        questionToAdd.answers = questionAnswers;
        this.setState({
            questionToAdd: questionToAdd
        });
    }

    onSetCorrectOption = (optionIndex: number) => {
        let questionToAdd = { ...this.state.questionToAdd };
        let questionAnswers: IAnswer[] = [...questionToAdd.answers].map((answer, i) => {
            return {
                answerText: answer.answerText,
                isCorrect: optionIndex === i
            }
        });

        questionToAdd.answers = questionAnswers;
        this.setState({
            questionToAdd: questionToAdd
        });
    }

    onAddQuestion = async () => {
        try {
            const newQuestion: IQuestion = { ...this.state.questionToAdd };
            const questionIsValid: boolean = this.validateQuestion(newQuestion);
            if (!questionIsValid)
                return;

            this.props.showLoader();
            const questionId: string = await this.addQuestion(newQuestion, this.state.roomCode);
            newQuestion.id = questionId;

            const questions = [...this.state.questions];
            questions.push(newQuestion);

            this.setState({
                questions: questions,
                questionToAdd: this.emptyQuestion
            })
            this.props.hideLoader();
        } catch (err) {
            this.props.hideLoader();
        }
    }

    addQuestion = async (question: IQuestion, roomCode: string): Promise<string> => {
        const resp = await axios.post<IQuestion>(`${config.apiUrl}questions/${roomCode}/PostQuestion`, question);
        console.log(resp);
        return resp.data.id as string;
    }

    validateQuestion = (question: IQuestion) => {
        if (!question || !question.questionText.trim())
            return false;

        if (!question.answers.every(answer => answer.answerText && answer.answerText.trim()))
            return false;

        if (!question.answers.some(answer => answer.isCorrect))
            return false;

        return true;
    }

    onFinish = async () => {
        await this.onAddQuestion();
        this.props.history.push('/');
    }

    render() {

        let addedQuestions = null;
        if (this.state.questions && this.state.questions.length > 0) {
            addedQuestions = this.state.questions.map((question, i) => {
                return (
                    <AddedQuestion key={question.id ? question.id : i} question={question} questionNumber={i + 1} />
                )
            })
        }

        return (
            <div className={classes.createGame}>
                <div className={classes.createGameContainer}>
                    <div className={classes.createGameHeader}>
                        Game ID: {this.state.roomCode}
                        <button onClick={this.onFinish} className={[classes.finishButton, 'button clear-button large-button'].join(' ')} >Finish</button>
                    </div>
                    <div className={classes.createGameContent}>
                        <AddQuestionForm question={this.state.questionToAdd} questionChange={this.onChangeQuestion} optionChange={this.onChangeOption} setCorrectOption={this.onSetCorrectOption} />
                        <div className={classes.addQuestion}>
                            <button className="button clear-button" onClick={this.onAddQuestion}>+ Add Question</button>
                        </div>
                        {addedQuestions}
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateGame;