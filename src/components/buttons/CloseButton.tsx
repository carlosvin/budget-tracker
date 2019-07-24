
import * as React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { AppButtonProps, AppButton } from './buttons';

export const CloseButton: React.FC<AppButtonProps> = (props) => (
    <AppButton icon={CloseIcon} aria-label='Close' {...props} />
);
