import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

export const SnackbarError: React.FC<{error: string}> = (props) => {
    const [close, setClose] = React.useState();

    function handleClose () {
        setClose(true);
    }

    return (
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
        open={!close}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{ 'aria-describedby': 'error-message-id', }}
        message={<span id="error-message-id">{props.error}</span>}
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