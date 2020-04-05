import React from 'react'
import classes from './waiting-area.module.css';


const WaitingArea = () => {
    return (
        <div className={classes.waitingArea}>
            <div className={classes.waitingAreaHeader}>
                Waiting For the Game to start
            </div>
            <div className={classes.loader}>

            </div>
            The Game hasn't started yet.

            While you wait for it to start, let's go over the rules.
            <ol>
                <li>The quiz consists of multiple choice questions.</li>
                <li>Each question will have 4 options with exactly one correct answer.</li>
                <li>You will have 20 seconds to submit your response. You can submit your response by clicking an option of your choice.</li>
                <li>Once submitted, the response cannot be changed.</li>
                <li>You will get <strong>10 points</strong> for every correct response and an additional <strong>10 points</strong> for being the first person to respond correctly.</li>
                <li>Results will be declared at the end of the quiz.</li>
            </ol>
        </div>
    )
}

export default WaitingArea;