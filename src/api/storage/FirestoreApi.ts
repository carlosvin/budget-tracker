import { Budget, BudgetsMap, ExpensesMap, Expense, Categories, Category, User } from '../../interfaces';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { StorageApi } from './StorageApi';

export class FirestoreApi implements StorageApi {
    
    private readonly db: firebase.firestore.Firestore;
    private readonly userId: string;

    constructor(userId: string) {
        if (userId) {
            this.userId = userId;
            this.db = firebase.firestore();
            this.db.enablePersistence();    
        } else {
            throw Error('User must be logged in to be able to use firestore');
        }
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

    getExpensesCol (budgetId: string) {
        return this.getBudgetDoc(budgetId).collection('expenses');
    }

    getExpenseDoc (budgetId: string, expenseId: string) {
        return this.getExpensesCol(budgetId).doc(expenseId);
    }

    get categoriesCol () {
        return this.userDoc.collection('categories');
    }

    getCategoryDoc(categoryId: string) {
        return this.categoriesCol.doc(categoryId);
    }

    async saveBudget(budget: Budget) {
        await this.getBudgetDoc(budget.identifier).set(budget);
        return this.setLastTimeSaved();
    }

    async deleteBudget(budgetId: string) {
        await this.getBudgetDoc(budgetId).delete();
        return this.setLastTimeSaved();
    }

    async setBudgets(budgets: BudgetsMap) {
        const batch = this.db.batch();
        Object
            .entries(budgets)
            .forEach(([k,budget]) => batch.set(
                this.db.collection('budgets').doc(k), 
                budget));
        await batch.commit();
        return this.setLastTimeSaved();
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
        const querySnapshot = await this.budgetsCol.orderBy('from', 'desc').get();
        const budgets: {[k: string]: Budget} = {};
        querySnapshot.forEach((doc) => {
            budgets[doc.id] = doc.data() as Budget;
        });
        return budgets;
    }
    
    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        const querySnapshot = await this
            .getExpensesCol(budgetId)
            .orderBy('when', 'desc')
            .get();
        const expenses: ExpensesMap = {};
        querySnapshot.forEach((doc) => {
            expenses[doc.id] = doc.data() as Expense;
        });
        return expenses;
    }

    async saveExpenses(budgetId: string, expenses: Expense[]) {
        const batch = this.db.batch();
        Object
            .entries(expenses)
            .forEach(([k, expense]) => batch.set(
                this.getExpensesCol(budgetId).doc(k), 
                expense));
        await batch.commit();
        return this.setLastTimeSaved();
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        await this.getExpenseDoc(budgetId, expenseId).delete();
        return this.setLastTimeSaved();
    }

    async getCategories(): Promise<Categories> {
        const querySnapshot = await this.categoriesCol.orderBy('name').get();
        const categories: Categories = {};
        querySnapshot.forEach((doc) => {
            categories[doc.id] = doc.data() as Category;
        });
        return categories;    
    }

    async saveCategory(category: Category){
        await this.getCategoryDoc(category.id).set(category);
        return this.setLastTimeSaved();
    }

    async saveCategories(categories: Categories){
        const batch = this.db.batch();
        Object
            .entries(categories)
            .forEach(([k, category]) => batch.set(
                this.categoriesCol.doc(k), 
                category));
        await batch.commit();
        return this.setLastTimeSaved();
    }

    async deleteCategory(categoryId: string){
        await this.getCategoryDoc(categoryId).delete();
        return this.setLastTimeSaved();
    }

    async getLastTimeSaved () {
        try {
            return ((await this.userDoc.get()).data() as User).timestamp || 0;
        } catch (error) {
            console.warn('Cannot retrieve timestamp from firebase');
            return 0;
        }
    }

    async setLastTimeSaved (timestamp=new Date().getTime()) {
        return this.userDoc.set({timestamp});
    }
}
