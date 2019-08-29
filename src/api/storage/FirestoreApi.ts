import { Budget, BudgetsMap, ExpensesMap, Expense, Categories, Category, User, ExportDataSet } from '../../interfaces';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { SubStorageApi } from './StorageApi';

export class FirestoreApi implements SubStorageApi {
    
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

    async saveBudget(budget: Budget, timestamp?: number) {
        await this.getBudgetDoc(budget.identifier).set(budget);
        return this.setLastTimeSaved(timestamp);
    }

    async deleteBudget(budgetId: string, timestamp?: number) {
        await this.getBudgetDoc(budgetId).delete();
        return this.setLastTimeSaved(timestamp);
    }

    async setBudgets(budgets: BudgetsMap, timestamp?: number) {
        const batch = this.db.batch();
        Object
            .entries(budgets)
            .forEach(([k,budget]) => batch.set(
                this.getBudgetDoc(k), 
                budget));
        await batch.commit();
        return this.setLastTimeSaved(timestamp);
    }

    async getBudget (id: string) {
        try {
            const doc = await this.getBudgetDoc(id).get();
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

    async saveExpenses(budgetId: string, expenses: Expense[], timestamp?: number) {
        const batch = this.db.batch();
        Object
            .values(expenses)
            .forEach(expense => batch.set(
                this.getExpensesCol(budgetId).doc(expense.identifier), 
                expense));
        await batch.commit();
        return this.setLastTimeSaved(timestamp);
    }

    async deleteExpense(budgetId: string, expenseId: string, timestamp?: number) {
        await this.getExpenseDoc(budgetId, expenseId).delete();
        return this.setLastTimeSaved(timestamp);
    }

    async getCategories(): Promise<Categories> {
        const querySnapshot = await this.categoriesCol.orderBy('name').get();
        const categories: Categories = {};
        querySnapshot.forEach((doc) => {
            categories[doc.id] = doc.data() as Category;
        });
        return categories;    
    }

    async saveCategory(category: Category, timestamp?: number){
        await this.getCategoryDoc(category.id).set(category);
        return this.setLastTimeSaved(timestamp);
    }

    async saveCategories(categories: Categories, timestamp?: number){
        const batch = this.db.batch();
        Object
            .entries(categories)
            .forEach(([k, category]) => batch.set(
                this.categoriesCol.doc(k), 
                category));
        await batch.commit();
        return this.setLastTimeSaved(timestamp);
    }

    async deleteCategory(categoryId: string, timestamp?: number){
        await this.getCategoryDoc(categoryId).delete();
        return this.setLastTimeSaved(timestamp);
    }

    async getLastTimeSaved () {
        try {
            return ((await this.userDoc.get()).data() as User).timestamp || 0;
        } catch (error) {
            console.warn('Cannot retrieve timestamp from firebase');
            return 0;
        }
    }

    async setLastTimeSaved (timestamp?: number) {
        if (timestamp) {
            return this.userDoc.set({timestamp});
        }
    }

    async import(data: ExportDataSet) {
        const {budgets, expenses, categories} = data;
        const batch = this.db.batch();
        Object
            .values(categories)
            .forEach(category => batch.set(this.getCategoryDoc(category.id), category));
        for (const budgetId in data.budgets) {
            batch.set(
                this.getBudgetDoc(budgetId), 
                budgets[budgetId]);
            for (const expenseId in expenses[budgetId]) {
                batch.set(
                    this.getExpenseDoc(budgetId, expenseId), 
                    expenses[budgetId][expenseId]);
            }
        }
        return batch.commit();
    }

    private async getExpensesWithBudgetId (budgetId: string): Promise<[string, ExpensesMap]> {
        return [budgetId, await this.getExpenses(budgetId)];
    }

    async export(): Promise<ExportDataSet> {
        const [budgets, categories, lastTimeSaved] = await Promise.all([this.getBudgets(), this.getCategories(), this.getLastTimeSaved()]);
        const expensesEntries = await Promise.all(Object
            .keys(budgets)
            .map(budgetId => this.getExpensesWithBudgetId(budgetId)));
        const expenses: {[budgetId: string]: ExpensesMap} = {};
        expensesEntries.forEach(([budgetId, eMap]) => expenses[budgetId] = eMap);

        return {budgets, expenses, categories, lastTimeSaved};
    }
}
