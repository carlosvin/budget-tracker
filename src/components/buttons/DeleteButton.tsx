
import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { AppButtonProps, AppButton } from './buttons';

export const DeleteButton = (props: AppButtonProps) => (
    <AppButton icon={DeleteIcon} aria-label='Delete' {...props}/>
);
