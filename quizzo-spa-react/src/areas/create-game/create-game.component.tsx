import React, { Component } from 'react';
import classes from './create-game.module.css';
import { IQuestion } from '../../interfaces/IQuestion';
import AddQuestionForm from './add-question-form/add-question-form.component';
import AddedQuestion from './added-question/added-question.component';
import { IAnswer } from '../../interfaces/IAnswer';

interface ICreateGameState {
    gameId: string;
    questions: IQuestion[];
    questionToAdd: IQuestion
}

class CreateGame extends Component<any, ICreateGameState> {
    emptyQuestion = {
        Id: '',
        QuestionText: '',
        Answers: [
            {
                AnswerText: '',
                IsCorrect: false
            },
            {
                AnswerText: '',
                IsCorrect: false
            },
            {
                AnswerText: '',
                IsCorrect: false
            },
            {
                AnswerText: '',
                IsCorrect: false
            },
        ]
    }
    constructor(props: any) {
        super(props);
        this.state = {
            gameId: '00000',
            questions: [],
            questionToAdd: this.emptyQuestion
        }
    }

    onChangeQuestion = (newValue: string) => {
        let questionToAdd = { ...this.state.questionToAdd };
        questionToAdd.QuestionText = newValue;
        this.setState({
            questionToAdd: questionToAdd
        })
    }

    onChangeOption = (newValue: string, optionIndex: number) => {
        let questionToAdd = { ...this.state.questionToAdd };
        let questionAnswers = [...questionToAdd.Answers];
        let questionOption = { ...questionAnswers[optionIndex] };
        questionOption.AnswerText = newValue;
        questionAnswers[optionIndex] = questionOption;
        questionToAdd.Answers = questionAnswers;
        this.setState({
            questionToAdd: questionToAdd
        });
    }

    onSetCorrectOption = (optionIndex: number) => {
        let questionToAdd = { ...this.state.questionToAdd };
        let questionAnswers: IAnswer[] = [...questionToAdd.Answers].map((answer, i) => {
            return {
                AnswerText: answer.AnswerText,
                IsCorrect: optionIndex === i
            }
        });

        // let questionOption = { ...questionAnswers[optionIndex] };
        // questionOption.IsCorrect = true;
        // questionAnswers[optionIndex] = questionOption;
        questionToAdd.Answers = questionAnswers;
        this.setState({
            questionToAdd: questionToAdd
        });
    }

    onAddQuestion = () => {
        const questionIsValid: boolean = this.validateQuestion(this.state.questionToAdd);
        if (!questionIsValid)
            return;
        //TODO: fetch QuestionID
        const questions = [...this.state.questions];
        questions.push(this.state.questionToAdd);
        this.setState({
            questions: questions,
            questionToAdd: this.emptyQuestion
        })
    }

    validateQuestion = (question: IQuestion) => {
        if (!question || !question.QuestionText.trim())
            return false;

        if (!question.Answers.every(answer => answer.AnswerText && answer.AnswerText.trim()))
            return false;

        if (!question.Answers.some(answer => answer.IsCorrect))
            return false;

        return true;
    }

    onFinish = () => {
        this.onAddQuestion();
    }
    render() {
        return (
            <div className={classes.createGame}>
                <div className={classes.createGameContainer}>
                    <div className={classes.createGameHeader}>
                        Game ID: {this.state.gameId}
                        <button onClick={this.onFinish} className="button clear-button large-button" style={{float: 'right', color: 'white'}}>Finish</button>
                    </div>
                    <div className={classes.createGameContent}>
                        <div>
                            {this.state.questions.map((question, i) => {
                                return (
                                    <AddedQuestion question={question} />
                                )
                            })}
                            <AddQuestionForm question={this.state.questionToAdd} questionChange={this.onChangeQuestion} optionChange={this.onChangeOption} setCorrectOption={this.onSetCorrectOption} />

                        </div>
                        <div className={classes.addQuestion}>
                            <button className="button clear-button" onClick={this.onAddQuestion}>
                                + Add Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateGame;