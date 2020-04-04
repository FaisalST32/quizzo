import React, { FunctionComponent, Fragment } from 'react'
import { IQuestion } from '../../../interfaces/IQuestion';
import classes from './question-area.module.css';
type QuestionAreaProps = {
    timer: number,
    question?: IQuestion,
    selectOption: any,
    selectedOption: string,
    questionNumber: number
}

const QuestionArea: FunctionComponent<QuestionAreaProps> = props => {
    const optionLabels = ['A', 'B', 'C', 'D'];
    const options = props.question?.Answers.map((answer, i) => {
        const isSelected = props.selectedOption === answer.Id;
        const cssClasses = [classes.option]
        if (isSelected) {
            cssClasses.push(classes.selected)
        }
        return (
            <div key={answer.Id}
                className={cssClasses.join(' ')}
                onClick={() => { props.selectOption(props.question?.Id, answer.Id) }}>
                <small>{optionLabels[i]}.</small> {answer.AnswerText}
            </div>
        )
    })
    return (
        <Fragment>
            <div className={classes.timer} style={{width: ((props.timer / 20) * 100).toString() + '%'}}></div>
            <div className={classes.questionArea}>
                <div className={classes.questionText}>
                    <small>Q. </small>{props.question?.QuestionText}
                </div>
                {options}
            </div>
        </Fragment>

    )
}

export default QuestionArea;