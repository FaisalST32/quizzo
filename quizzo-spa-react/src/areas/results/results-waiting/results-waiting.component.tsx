import React from 'react'
import classes from './results-waiting.module.css';


const ResultsWaiting = () => {
    return (
        <div className={classes.waitingArea}>
            <div className={classes.waitingAreaHeader}>
                Waiting For the Game to Finish
            </div>
            <div className={classes.loader}>

            </div>


        </div>
    )
}

export default ResultsWaiting;