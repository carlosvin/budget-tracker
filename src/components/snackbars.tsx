import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

interface SnackbarAppProps {
    message: string;
    type?: string;
}

export const SnackbarApp: React.FC<SnackbarAppProps> = (props) => {
    const [close, setClose] = React.useState<boolean>();
    const type = props.type || 'default';
    const messageId = `${type}-message-id`;

    function handleClose () {
        setClose(true);
    }

    return (
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
        open={!close}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{ 'aria-describedby': messageId }}
        message={<span id={messageId}>{props.message}</span>}
        action={[
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon />
            </IconButton>,
        ]}
    />);
}

export const SnackbarError: React.FC<SnackbarAppProps> = (props) => (
    <SnackbarApp type='error' {...props}/>
); 

export const SnackbarInfo: React.FC<SnackbarAppProps> = (props) => (
    <SnackbarApp type='info' {...props}/>
); 
