import { Budget, BudgetsMap } from '../interfaces';
import firebase from 'firebase/app';
// Required for side-effects
require("firebase/firestore");
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

export class FirebaseApi {

    readonly uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult: string, redirectUrl: string) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
          },
          uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        // signInSuccessUrl: '<url-to-redirect-to-on-success>',
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

    private readonly db: firebase.firestore.Firestore;

    constructor() {
        firebase.initializeApp(config);
        this.db = firebase.firestore();
        this.enablePersistence();
    }

    async startAuth () {
        const firebaseui = await import('firebaseui');
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#root', {
            signInOptions: [
              // List of OAuth providers supported.
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
        });
    }

    private async enablePersistence() {
        try {
            await this.db.enablePersistence();
        } catch (error) {
            console.warn(error);
        }
    }

    get userId () {
        const user = firebase.auth().currentUser;
        return user && user.email;
    }

    async addBudget(budget: Budget) {
        const docRef = await this.db
            .collection('budgets')
            .add(budget);
        return docRef.id;
    }

    async setBudget(id: string, budget: Budget) {
        try {
            await this.db
                .collection('budgets')
                .doc(id)
                .set(budget);
            return id;
        } catch (error) {
            console.warn('Cannot save budget: ', error);
            return null;
        }
    }

    async setBudgets(budgets: BudgetsMap) {
        try {
            const batch = this.db.batch();
            Object
                .entries(budgets)
                .forEach(([k,budget]) => batch.set(
                    this.db.collection('budgets').doc(k), 
                    budget));
            return batch.commit();
        } catch (error) {
            console.warn('Cannot save budgets: ', error);
            return null;
        }
    }

    async getBudget (id: string) {
        try {
            const doc = await this.db.collection('budgets').doc(id).get();
            return doc.data() as Budget;
        } catch (error) {
            console.warn('Cannot get budget: ', error);
            return null;
        }
    }

    async getBudgets (): Promise<BudgetsMap> {
        if (this.userId) {
            const querySnapshot = await this.db
            .collection('budgets')
            .where("users", "array-contains", this.userId)
            .get();
            const budgets: {[k: string]: Budget} = {};
            querySnapshot.forEach((doc) => {
                budgets[doc.id] = doc.data() as Budget;
            });
            return budgets;
        }
        throw new Error('User is not logged in');
    }

    get auth () {
        return firebase.auth();
    }

    /* TODO decide if it is better to just subscribe to changes and 
    how to propagate changes to react components
    subscribeToBudgets () {
        this.db.collection('budgets').where("users", "array-contains", this.userId)
    .onSnapshot(function(querySnapshot) {
        var cities = [];
        querySnapshot.forEach(function(doc) {
            cities.push(doc.data().name);
        });
        console.log("Current cities in CA: ", cities.join(", "));
    });

    }*/
}

export const firebaseApi = new FirebaseApi();
