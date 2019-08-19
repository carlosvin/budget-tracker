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

    async addBudget(budget: Budget) {
        const docRef = await this.db
            .collection('budgets')
            .add(budget);
        return docRef.id;
    }

    async saveBudget(budget: Budget) {
        return this.getBudgetDoc(budget.identifier).set(budget);
    }

    async deleteBudget(budgetId: string) {
        return this.getBudgetDoc(budgetId).delete();
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

    async saveExpense(budgetId: string, expense: Expense){
        return this.getExpenseDoc(budgetId, expense.identifier).set(expense);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        return this.getExpenseDoc(budgetId, expenseId).delete();
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
        return this.getCategoryDoc(category.id).set(category);
    }

    async saveCategories(categories: Categories){
        throw Error('Not implemented, we have to remove this method and use finer grain ones');
    }

    async deleteCategory(categoryId: string){
        return this.getCategoryDoc(categoryId).delete();
    }

    async getLastTimeSaved () {
        return ((await this.userDoc.get()).data() as User).timestamp;
    }

    async updateUserTimestamp () {
        return this.userDoc.update({timestamp: new Date().getTime()});
    }
}
