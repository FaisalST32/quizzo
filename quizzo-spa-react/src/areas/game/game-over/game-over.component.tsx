import React from 'react';
import classes from './game-over.module.css';

const GameOver = (props: any) => {
    return (
        <div className={classes.gameOver}>
            Game Over<br />
            <button className="button large-button primary-button" onClick={props.viewResults}>
                View Results
            </button>
        </div>
    )
}

export default GameOver;