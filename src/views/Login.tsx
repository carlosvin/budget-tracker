// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

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
        isSignedIn: false, // Local signed-in state.
        showDialog: false
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

    private handleLogin = () => {
        this.setState({showDialog: true});
    }

    private handleClose = () => {
        this.setState({showDialog: false});
    }

    render() {
        return <React.Fragment>
            <this.Button />
            <LoginDialog onClose={this.handleClose} open={this.state.showDialog && !this.state.isSignedIn}/>
        </React.Fragment>;
        
    }

    private Button = () => {
        if (this.state.isSignedIn) {
            return <AccountButton onClick={() => firebase.auth().signOut()}
                aria-controls="menu-appbar"
                aria-haspopup="true"
            />;
        } else {
            return <TextButton text='Login' onClick={this.handleLogin}/>;
        }
    }
}
