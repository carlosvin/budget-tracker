import * as firebase from 'firebase/app';
// Required for side-effects
import "firebase/auth";

// Firebase configuration
const config = {
    apiKey: "AIzaSyDYiJ453cQ7Gw2rJoc2aUT8-eIR-3o_--c",
    authDomain: "budget-tracker-e611b.firebaseapp.com",
    databaseURL: "https://budget-tracker-e611b.firebaseio.com",
    projectId: "budget-tracker-e611b",
    storageBucket: "",
    messagingSenderId: "52933279347",
    appId: "1:52933279347:web:3c02df71353d7cab"
};

export class FirebaseApi  {

    constructor(inputConf = config) {
        firebase.initializeApp(inputConf);        
    }

    get auth () {
        return firebase.auth();
    }

    get firestore () {
        return firebase.firestore();
    }

    /** If user is not authenticated will return null  */
    get userId () {
        const user = this.auth.currentUser;
        if (user && user.email) {
            return user.email;
        } else {
            return null;
        }
    }
}

export const firebaseApi = new FirebaseApi();
