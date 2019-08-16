import { Budget, BudgetsMap } from '../interfaces';
import firebase from 'firebase/app';
require("firebase/auth");

// TODO try    https://medium.com/firebase-developers/how-to-setup-firebase-authentication-with-react-in-5-minutes-maybe-10-bb8bb53e8834

// TODO try https://react-firebase-js.com/docs/react-firebase-auth/getting-started#install

// once user is logged in, we just need the firebase token to call to store
// if auth then use firebase with offline mode
// else use local storage 

// Configure Firebase.
const config = {
    apiKey: "AIzaSyDYiJ453cQ7Gw2rJoc2aUT8-eIR-3o_--c",
    authDomain: "budget-tracker-e611b.firebaseapp.com",
    databaseURL: "https://budget-tracker-e611b.firebaseio.com",
    projectId: "budget-tracker-e611b",
    storageBucket: "",
    messagingSenderId: "52933279347",
    appId: "1:52933279347:web:3c02df71353d7cab"
};

class AuthApi {

    readonly uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
    };

    constructor() {
        firebase.initializeApp(config);
    }

    async startAuth() {
        if (!this.isAuth) {
            const firebaseui = await import('firebaseui');
            const ui = new firebaseui.auth.AuthUI(this.auth);
            this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            return new Promise<string>((resolve, reject) => {
                ui.start('#root', {
                    ...this.uiConfig,
                    callbacks: {
                        signInSuccessWithAuthResult: (authResult: any, redirectUrl: string) => {
                            resolve(authResult);
                            return false;
                        },
                        signInFailure: (error: firebaseui.auth.AuthUIError) => {
                            console.error(error);
                            return Promise.reject();
                        }

                    }
                });
            });
        }
    }

    async logout() {
        return this.auth.signOut();
    }

    get userId() {
        const user = this.auth.currentUser;
        return user && user.email;
    }

    get isAuth() {
        return Boolean(this.userId);
    }

    get auth() {
        return firebase.auth();
    }
}

export const authApi = new AuthApi();