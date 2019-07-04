import { StorageApi } from "./StorageApi";
import { Budget, BudgetsMap, ExpensesMap, Expense } from '../interfaces';
// Required for side-effects
import { FirebaseApi } from "./FirebaseApi";
import "firebase/firestore";

export class FirestoreApi implements StorageApi {

    private readonly db: firebase.firestore.Firestore;
    private readonly userId: string; 

    constructor(firebaseApi: FirebaseApi) {
        this.db = firebaseApi.firestore;
        this.enablePersistence();
        const uid = firebaseApi.userId;
        if (uid) {
            this.userId = uid;
        } else {
            throw new Error('Firebase api requires logged in user');
        }
    }

    async getBudgets(): Promise<BudgetsMap> {
        const querySnapshot = await this.userDoc
            .collection('budgets')
            .get();
        
        const budgets: BudgetsMap = {};
        querySnapshot.forEach((doc) => {
            budgets[doc.id] = doc.data() as Budget;
        });
        return budgets;
    }

    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        if (this.userId) {
            // TODO ordered by date
            const querySnapshot = await this.budgetDoc(budgetId)
                .collection('expenses')
                .get();
            const expenses: ExpensesMap = {};
            querySnapshot.forEach((doc) => {
                expenses[doc.id] = doc.data() as Expense;
            });
            return expenses;
        }
        throw new Error('User is not logged in');
    }

    async saveBudget(budget: Budget) {
        return this.budgetDoc(budget.identifier).set(budget);
    }

    async saveExpense(budgetId: string, expense: Expense): Promise<void> {
        return this.expenseDoc(budgetId, expense.identifier).set(expense);
    }

    async deleteBudget(budgetId: string): Promise<void> {
        return this.budgetDoc(budgetId).delete();
    }

    async deleteExpense(budgetId: string, expenseId: string): Promise<void> {
        return this.expenseDoc(budgetId, expenseId).delete();
    }

    get userDoc() {
        return this.db
            .collection('users')
            .doc(this.userId);
    }

    budgetDoc(budgetId: string) {
        return this.userDoc
            .collection('budgets')
            .doc(budgetId);
    }

    expenseDoc(budgetId: string, expenseId: string) {
        return this.budgetDoc(budgetId)
            .collection('expenses')
            .doc(expenseId);
    }

    private async enablePersistence() {
        try {
            await this.db.enablePersistence();
        } catch (error) {
            console.warn(error);
        }
    }


    async addBudget(budget: Budget) {
        const docRef = await this.db
            .collection('budgets')
            .add(budget);
        return docRef.id;
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
