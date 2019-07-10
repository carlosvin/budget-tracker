// Import FirebaseAuth and firebase.
import React from 'react';
import * as firebase from 'firebase/app';
import { firebaseApi } from '../api/FirebaseApi';
import { LoginDialog } from '../components/LoginDialog';

export const LoginContext = React.createContext({isSignedIn: false});

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


    private handleClose = (e: React.SyntheticEvent) => {
        // do not close unless user is logged in
        e.preventDefault(); 
    }

    render() {
        return (
        <LoginContext.Provider value={{isSignedIn: this.state.isSignedIn}}>
            <LoginDialog onClose={this.handleClose} open={this.state.isSignedIn === false}/>
            { this.props.children }
        </LoginContext.Provider>);
        
    }
}
