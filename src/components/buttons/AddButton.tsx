
import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { ButtonFabProps, ButtonFab } from './buttons';

export const AddButton: React.FC<ButtonFabProps> = (props) => (
    <ButtonFab aria-label='Add' {...props} color='primary'>
        <AddIcon />
    </ButtonFab>);