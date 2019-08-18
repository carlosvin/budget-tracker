import { Budget, BudgetsMap } from '../interfaces';
// Required for side-effects\
// import 'firebase/firestore';

// TODO try    https://medium.com/firebase-developers/how-to-setup-firebase-authentication-with-react-in-5-minutes-maybe-10-bb8bb53e8834

// TODO try https://react-firebase-js.com/docs/react-firebase-auth/getting-started#install

// once user is logged in, we just need the firebase token to call to store
// if auth then use firebase with offline mode
// else use local storage 

 export class FirebaseApi {

    


    private readonly db: firebase.firestore.Firestore;

    constructor(app: firebase.app.App) {
        this.db = app.firestore();this.db.enablePersistence();
    }

/*    private async enablePersistence() {
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

// export const firebaseApi = new FirebaseApi();
