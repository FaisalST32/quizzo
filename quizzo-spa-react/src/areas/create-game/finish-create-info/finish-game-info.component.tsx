import React, { FunctionComponent } from 'react';
import classes from './finish-game-info.module.css';

type FinishGameInfoProps = {
    adminCode: number;
    roomCode: string;
    startGame: () => void;
    stopGame: () => void;
    hasGameStarted: boolean;
};

const FinishGameInfo: FunctionComponent<FinishGameInfoProps> = (props) => {
    const getShareCode = () => {
        return `${window.location.origin}/${props.roomCode}`;
    };

    const getAdminCode = () => {
        return `${window.location.origin}/create-game/${props.roomCode}/${props.adminCode}`;
    };

    const onCopyCode = () => {
        navigator.clipboard.writeText(getShareCode());
    };

    const onCopyAdminCode = () => {
        navigator.clipboard.writeText(getAdminCode());
    };

    return (
        <div className={classes.finishGameInfo}>
            <p>Your game is now ready.</p>

            <div className={classes.inviteArea}>
                <small>Invite Link: </small>
                <input
                    type="text"
                    readOnly
                    className={classes.inviteLinkInput}
                    value={getShareCode()}
                />
                <button onClick={onCopyCode} className="button clear-button">
                    Copy
                </button>
            </div>
            <p>
                Copy the invite link to share with your friends or simply share
                the invite code{' '}
                <span className={classes.roomCode}>{props.roomCode}</span>
            </p>
            <p>
                Your Admin Code is: <strong>{props.adminCode}</strong>
            </p>
            <p>Or you can use the link below to administer the game.</p>
            <div className={classes.inviteArea}>
                <small>Admin Link: </small>
                <input
                    type="text"
                    readOnly
                    className={classes.inviteLinkInput}
                    value={getAdminCode()}
                />
                <button
                    onClick={onCopyAdminCode}
                    className="button clear-button"
                >
                    Copy
                </button>
            </div>
            {props.hasGameStarted ? (
                <p>
                    The game has started. Once all the participants have
                    finished, you can press the <strong>Stop Game</strong>{' '}
                    button to calculate the results.
                </p>
            ) : (
                <p>
                    The game has not started yet. Once all the participants are
                    ready, you can press the <strong>Start Game</strong> button
                    to begin.
                </p>
            )}
            <div className={classes.gameControlsArea}>
                {props.hasGameStarted ? (
                    <button
                        onClick={props.stopGame}
                        className="button danger-button large-button"
                    >
                        Stop Game
                    </button>
                ) : (
                    <button
                        onClick={props.startGame}
                        className="button success-button large-button"
                    >
                        Start Game
                    </button>
                )}
            </div>
        </div>
    );
};

export default FinishGameInfo;
