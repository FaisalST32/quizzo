import React, { FunctionComponent } from 'react'
import classes from './add-question-form.module.css';

import { IQuestion } from '../../../interfaces/IQuestion';

type AddQuestionFormProps = {
    question: IQuestion,
    questionChange: any,
    optionChange: any,
    setCorrectOption: any
}

const AddQuestionForm: FunctionComponent<AddQuestionFormProps> = (props) => {
    return (
        <div>
            <textarea className={classes.input}
                value={props.question.QuestionText}
                onChange={(e) => { props.questionChange(e.target.value) }}
                placeholder="Question Text"></textarea>

            {props.question.Answers.map((answer, i) => {
                let setCorrectArea = <button onClick={() => { props.setCorrectOption(i) }} className={classes.markCorrectButton}>Mark Correct</button>

                if (answer.IsCorrect) {
                    setCorrectArea = <button disabled={true} className={[classes.markCorrectButton, classes.marked].join(' ')}>Correct Option</button>
                }


                return (
                    <React.Fragment>
                        <div className={classes.option}>
                            <input className={classes.input} type="text"
                                key={i}
                                value={answer.AnswerText}
                                placeholder={'Option ' + +(i + 1)}
                                onChange={e => { props.optionChange(e.target.value, i) }} />
                            {setCorrectArea}
                        </div>
                    </React.Fragment>
                )
            })}

        </div>
    )
}

export default AddQuestionForm;