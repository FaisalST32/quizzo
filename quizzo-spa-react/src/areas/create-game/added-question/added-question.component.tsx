import React, { FunctionComponent } from 'react'
import classes from './added-question.module.css';

import { IQuestion } from '../../../interfaces/IQuestion';

type AddedQuestionProps = {
    question: IQuestion,
    questionNumber: number
}

const AddedQuestion: FunctionComponent<AddedQuestionProps> = (props) => {
    return (
        <div className={classes.addedQuestion}>
            <div className={classes.questionText}>
                <small>Question no. {props.questionNumber}</small><br />
                {props.question.questionText}
            </div>
            {props.question.answers.map((answer, i) => {
                return (
                    <div key={i}>
                        <small>Option {i + 1}</small> <small style={{ color: 'green' }}>{answer.isCorrect ? '(Correct Option)' : ''}</small><br />
                        {answer.answerText}
                    </div>
                )
            })}
        </div>
    )
}

export default AddedQuestion;