// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FirebaseApi } from '../api/FirebaseApi';
import { btApp } from '../BudgetTracker';

interface LoginDialogProps {
    open: boolean;
    onClose: (e: React.SyntheticEvent)=>void;
}

export const LoginDialog: React.FC<LoginDialogProps> = (props) => {
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: FirebaseApi.PROVIDERS,
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    return (
        <Dialog aria-labelledby="sign-in-dialog" open={props.open} onClose={props.onClose}>
            <DialogTitle id="sign-in-dialog">Please sign-in</DialogTitle>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={btApp.firebaseApi.auth} />
        </Dialog>);
}
