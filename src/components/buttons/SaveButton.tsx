

import * as React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import { ButtonFab, ButtonFabProps, AppButtonProps, AppButton } from './buttons';


export const SaveButtonFab: React.FC<ButtonFabProps> = (props) => (
    <ButtonFab aria-label='Save' {...props} >
        <SaveIcon />
    </ButtonFab>
);

export const SaveButton: React.FC<AppButtonProps> = (props) => (
    <AppButton icon={SaveIcon} aria-label='Save' {...props}/>
);
