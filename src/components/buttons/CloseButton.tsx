
import * as React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { goBack } from '../../domain/utils/goBack';
import { History } from 'history';
import IconButton from '@material-ui/core/IconButton';

export const CloseButton: React.FC<{history: History, to?: string}> = (props) => {
    
    function handleBack () {
        goBack(props.history, props.to);
    }

    return (
        <IconButton 
            color='inherit'
            aria-label='Close' 
            {...props} 
            onClick={handleBack}>
            <CloseIcon/>
        </IconButton>
    );
}
