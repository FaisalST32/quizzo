import React, { FunctionComponent } from 'react';
import classes from './loading-screen.module.css';

type LoadingScreenProps = {
    show: boolean,
    color?: string,
    hideContent?: boolean
}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = props => {
    let laodingContent = null;
    const loaderOverlayClasses = [classes.loadingOverlay];
    if (props.hideContent) {
        loaderOverlayClasses.push(classes.opaqueOverlay);
    }
    if (props.show) {
        laodingContent = (
            <React.Fragment>
                <div className={loaderOverlayClasses.join(' ')}></div>
                <div className={classes.loader}></div>
            </React.Fragment>
        )
    }
    return laodingContent;
}

export default LoadingScreen;