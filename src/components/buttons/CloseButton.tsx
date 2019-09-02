
import * as React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { AppButton } from './buttons';
import { goBack } from '../../domain/utils/goBack';
import { History } from 'history';

export const CloseButton: React.FC<{history: History, to?: string}> = (props) => (
    <AppButton 
        icon={CloseIcon} 
        aria-label='Close' 
        {...props} 
        onClick={()=>goBack(props.history, props.to)}/>
);
