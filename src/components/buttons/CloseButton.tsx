
import * as React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { goBack } from '../../domain/utils/goBack';
import { History } from 'history';
import IconButton from '@material-ui/core/IconButton';

export const CloseButton: React.FC<{onClick: () => void}> = (props) => (
    <IconButton 
        color='inherit'
        aria-label='Close' 
        {...props} 
        onClick={props.onClick}>
        <CloseIcon/>
    </IconButton>
);

export const CloseButtonHistory: React.FC<{history: History, to?: string}> = (props) => {
    
    function handleBack () {
        goBack(props.history, props.to);
    }

    return (
        <CloseButton onClick={handleBack}/>
    );
}
