import React, { FunctionComponent } from 'react';
import classes from './loading-screen.module.css';

type LoadingScreenProps = {
    show: boolean,
    color?: string
}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = props => {
    let laodingContent = null;
    if (props.show) {
        laodingContent = (
            <React.Fragment>
                <div className={classes.loadingOverlay}></div>
                <div className={classes.loader}></div>
            </React.Fragment>

        )
    }
    return laodingContent;
}

export default LoadingScreen;