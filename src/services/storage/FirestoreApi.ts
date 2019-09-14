import { Budget, BudgetsMap, ExpensesMap, Expense, Categories, Category, User, ExportDataSet } from '../../interfaces';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { SubStorageApi, DbItem } from './StorageApi';


interface ExpenseDb extends Expense, DbItem { }
interface BudgetDb extends Budget, DbItem { }
interface CategoryDb extends Category, DbItem { }

export class FirestoreApi implements SubStorageApi {
    
    private readonly db: firebase.firestore.Firestore;
    private readonly userId: string;

    constructor(userId: string, enablePersistence=false) {
        if (userId) {
            this.userId = userId;
            this.db = firebase.firestore();
            if (enablePersistence) {
                this.enablePersistence();
            }
        } else {
            throw Error('User must be logged in to be able to use firestore');
        }
    }

    private enablePersistence () {
        try {
            this.db.enablePersistence();    
        } catch (error) {
            console.warn('Persistence is already enabled: ', error);
        }
    }

    // Firestore throws an error while saving fields with undefined values
    private removeUndefined <T>(object: T) {
        for (const id in object) {
            if (object[id] === undefined) {
                delete object[id];
            }
        }
        return object;
    }

    get userDoc () {
        return this.db.collection('users').doc(this.userId);
    }

    get budgetsCol() {
        return this.userDoc.collection('budgets');
    }

    getBudgetDoc (budgetId: string) {
        return this.budgetsCol.doc(budgetId);
    }

    get expensesCol() {
        return this.userDoc.collection('expenses');
    }

    getExpenseDoc (expenseId: string) {
        return this.expensesCol.doc(expenseId);
    }

    get categoriesCol () {
        return this.userDoc.collection('categories');
    }

    getCategoryDoc(categoryId: string) {
        return this.categoriesCol.doc(categoryId);
    }

    async setBudget(budget: Budget, timestamp: number) {
        return this._saveBudget({deleted: 0, ...budget, timestamp});
    }

    private async _saveBudget(budget: BudgetDb) {
        this.removeUndefined(budget);
        await this.getBudgetDoc(budget.identifier).set(budget);
        return this.setLastTimeSaved(budget.timestamp);
    } 

    async deleteBudget(budgetId: string, timestamp: number) {
        return this.deleteEntity(this.getBudgetDoc(budgetId), timestamp);
    }

    async getBudget (id: string) {
        try {
            const doc = await this.getBudgetDoc(id).get();
            return doc.data() as Budget;
        } catch (error) {
            console.warn(`Error getting budget ${id}: `, error);
            return undefined;
        }
    }

    async getBudgets (timestamp = 0): Promise<BudgetsMap> {
        const querySnapshot = await this.budgetsCol
            .where('deleted', '==',  0)
            .orderBy('timestamp', 'desc')
            .where('timestamp', '>', timestamp)
            .get();
        const budgets: {[k: string]: Budget} = {};
        querySnapshot.forEach((doc) => {
            budgets[doc.id] = doc.data() as Budget;
        });
        return budgets;
    }

    async getExpense(expenseId: string) {
        const expense = await this.getExpenseDoc(expenseId).get();
        return expense.data() as Expense;
    }
    
    async getExpenses(budgetId: string, timestamp = 0): Promise<ExpensesMap> {
        return this._getExpenses(budgetId, timestamp);
    }

    async _getExpenses(budgetId?: string, timestamp = 0): Promise<ExpensesMap> {
        let queryBuilder = await this.expensesCol.where('deleted', '==',  0);
        if (budgetId) {
            queryBuilder = queryBuilder.where('budgetId', '==', budgetId);
        }
        if (timestamp) {
            queryBuilder = queryBuilder.orderBy('timestamp').where('timestamp', '>', timestamp);
        }
        const querySnapshot = await queryBuilder.orderBy('when', 'desc').get();

        const expenses: ExpensesMap = {};
        querySnapshot.forEach((doc) => {
            expenses[doc.id] = doc.data() as Expense;
        });
        return expenses;
    }

    async setExpenses(expenses: Expense[], timestamp: number) {
        const batch = this.db.batch();
        Object
            .values(expenses)
            .forEach(expense => batch.set(
                this.getExpenseDoc(expense.identifier), 
                this.removeUndefined({deleted: 0, ...expense, timestamp})));
        this.setLastTimeSaved(timestamp, batch);
        return batch.commit();
    }

    async deleteExpense(expenseId: string, timestamp: number) {
        return this.deleteEntity(this.getExpenseDoc(expenseId), timestamp);
    }

    async getCategory(identifier: string) {
        const category = await this.getExpenseDoc(identifier).get();
        return category.data() as Category;
    }

    async getCategories(timestamp = 0): Promise<Categories> {
        const querySnapshot = await this.categoriesCol
            .where('deleted', '==',  0)
            .orderBy('timestamp')
            .where('timestamp', '>', timestamp)
            .orderBy('name').get();
        const categories: Categories = {};
        querySnapshot.forEach((doc) => {
            categories[doc.id] = doc.data() as Category;
        });
        return categories;    
    }

    async setCategories(categories: CategoryDb[], timestamp: number){
        const batch = this.db.batch();
        Object
            .values(categories)
            .forEach(category => batch.set(
                this.getCategoryDoc(category.identifier), 
                this.removeUndefined({deleted: 0, ...category, timestamp})));
        this.setLastTimeSaved(timestamp, batch);
        return batch.commit();
    }

    async saveCategories(categories: Categories, timestamp: number){
        const batch = this.db.batch();
        Object
            .entries(categories)
            .forEach(([k, category]) => batch.set(
                this.categoriesCol.doc(k), 
                this.removeUndefined({deleted: 0, ...category, timestamp})));
        await batch.commit();
        return this.setLastTimeSaved(timestamp);
    }

    async deleteCategory(categoryId: string, timestamp: number){
        return this.deleteEntity(this.getCategoryDoc(categoryId), timestamp);
    }

    async getLastTimeSaved () {
        try {
            return ((await this.userDoc.get()).data() as User).timestamp || 0;
        } catch (error) {
            console.warn('Cannot retrieve timestamp from firebase');
            return 0;
        }
    }

    async setLastTimeSaved (timestamp=Date.now() , batch?: firebase.firestore.WriteBatch) {
        if (batch) {
            batch.set(this.userDoc, {timestamp});
        } else {
            return this.userDoc.set({timestamp});
        }
    }

    private async deleteEntity (documentRef: firebase.firestore.DocumentReference, timestamp: number) {
        const deleted = await this.db.runTransaction(async function (transaction) {
            const entity = (await transaction.get(documentRef)).data() as DbItem;
            if (entity) {
                await transaction.set(documentRef, {...entity, deleted: 1, timestamp});
                return true;
            }
            return false;
        });
        if (deleted) {
            return this.setLastTimeSaved(timestamp);    
        }
    }

    async import(data: ExportDataSet) {
        const {budgets, expenses, categories, lastTimeSaved} = data;
        const batch = this.db.batch();
        Object
            .values(categories)
            .forEach(category => batch.set(
                this.getCategoryDoc(category.identifier), 
                this.removeUndefined({timestamp: lastTimeSaved, ...category})));
        Object
            .values(budgets)
            .forEach(budget => batch.set(
                this.getBudgetDoc(budget.identifier), 
                this.removeUndefined({timestamp: lastTimeSaved, ...budget})));
                
        Object.values(expenses).forEach(expense => batch.set(
            this.getExpenseDoc(expense.identifier), 
            this.removeUndefined({timestamp: lastTimeSaved, ...expense})));

        batch.set(this.userDoc, {timestamp: lastTimeSaved});
        return batch.commit();
    }

    async export(): Promise<ExportDataSet> {
        const [budgets, categories, expenses, lastTimeSaved] = await Promise.all(
            [
                this.getBudgets(), 
                this.getCategories(), 
                this._getExpenses(),
                this.getLastTimeSaved()]);

        return {budgets, expenses, categories, lastTimeSaved};
    }
}
