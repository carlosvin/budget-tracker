// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from 'firebase/app';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { firebaseApi } from '../api/Firebase';

const LoginContext = React.createContext({isSignedIn: false});

const LoginDialog: React.FC<{open: boolean, onClose: ()=>void}> = (props) => {
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    return (
        <Dialog aria-labelledby="sign-in-dialog" open={props.open} onClose={props.onClose}>
            <DialogTitle id="sign-in-dialog">Please sign-in</DialogTitle>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApi.auth} />
        </Dialog>);
}

export default class LoginComponent extends React.Component {

    private subs?: firebase.Unsubscribe;

    // The component's Local state.
    state = {
        isSignedIn: firebaseApi.userId !== undefined, // Local signed-in state.
    };

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.subs = firebase.auth().onAuthStateChanged(
            (user) => this.setState({ isSignedIn: !!user })
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.subs && this.subs();
    }


    private handleClose = () => {
        
    }

    render() {
        return <LoginContext.Provider value={{isSignedIn: this.state.isSignedIn}}>
            <LoginDialog onClose={this.handleClose} open={this.state.isSignedIn === false}/>
            { this.props.children }
        </LoginContext.Provider>;
        
    }
}
