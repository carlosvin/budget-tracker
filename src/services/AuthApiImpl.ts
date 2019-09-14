// import { Budget, BudgetsMap } from '../interfaces';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthApi } from './AuthApi';

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

export class AuthApiImpl implements AuthApi {

    private readonly _provider: firebase.auth.GoogleAuthProvider;
    readonly auth: firebase.auth.Auth;

    constructor() {
        this.auth = firebase.initializeApp(config).auth();
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        this._provider = new firebase.auth.GoogleAuthProvider();
    }

    async startAuth() {
        const result = await this.auth.signInWithPopup(this._provider);
        if (result.user) {
            return result.user.uid;
        }
    }

    async logout() {
        return this.auth.signOut();
    }

    async getUserId() {
        return new Promise<string|undefined>((resolve, reject) => {
            const subs = this.auth.onAuthStateChanged(
                (user) => (user ? resolve(user.uid) : resolve(undefined)),
                (error) => (reject(error)),
                () => (subs())
            );
        });
    }

    subscribe(onAuth: (uid?: string) => void) {
        return this.auth.onAuthStateChanged(function (user) {
            user ? onAuth(user.uid) : onAuth(undefined);
        });
    }
}
