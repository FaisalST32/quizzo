import React, { FunctionComponent } from 'react';
import classes from './create-game-info.module.css';

type CreateGameInfoProps = {
    roomCode: string;
    startAddingQuestions: any;
};

const CreateGameInfo: FunctionComponent<CreateGameInfoProps> = (props) => {
    return (
        <div className={classes.createGameInfo}>
            <p>
                Your Game Room Code is{' '}
                <span className={classes.roomCode}>{props.roomCode}</span>
                <br />
                Please save it as you will need it to share your game with
                participants.
            </p>
            <p>
                Next you will need to add questions to your game.
                <br />
                Each question you create should have four options with only one
                correct option.
            </p>
            <button
                className="button primary-button"
                onClick={props.startAddingQuestions}
            >
                + Start Adding Questions
            </button>
        </div>
    );
};

export default CreateGameInfo;
