import React, { FunctionComponent } from 'react'
import classes from './added-question.module.css';

import { IQuestion } from '../../../interfaces/IQuestion';

type AddedQuestionProps = {
    question: IQuestion
}

const AddedQuestion: FunctionComponent<AddedQuestionProps> = (props) => {
    return (
        <div className={classes.addedQuestion}>
            <div style={{fontSize: '30px'}}>
                <small>Question</small><br />
                {props.question.QuestionText}
            </div>
            {props.question.Answers.map((answer, i) => {
                return (
                    <div>
                        <small>Option {i + 1}</small> <small style={{color: 'green'}}>{answer.IsCorrect ? '(Correct Option)' : ''}</small><br />
                        {answer.AnswerText} 
                    </div>
                )
            })}
        </div>
    )
}

export default AddedQuestion;