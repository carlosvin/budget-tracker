import { StorageApi } from "./StorageApi";
import { Budget, Expense, Category, Categories } from "../../interfaces";
import { LocalStorage } from "./LocalStorage";

class AppStorageManager implements StorageApi {
    private _storage: StorageApi;
    
    constructor (storage: StorageApi) {
        this._storage = storage;
    }

    async getBudgets() {
        return this._storage.getBudgets();
    }
    async getExpenses(budgetId: string) {
        return this._storage.getExpenses(budgetId);
    }
    async saveBudget(budget: Budget) {
        return this._storage.saveBudget(budget);
    }
    
    async deleteBudget(budgetId: string) {
        return this._storage.deleteBudget(budgetId);
    }
    
    async saveExpense(budgetId: string, expense: Expense) {
        return this._storage.saveExpense(budgetId, expense);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        return this._storage.deleteExpense(budgetId, expenseId);
    }

    async getCategories() {
        return this._storage.getCategories();
    }

    async saveCategory(category: Category) {
        return this._storage.saveCategory(category);
    }

    async saveCategories(categories: Categories) {
        return this._storage.saveCategories(categories);
    }

    async switchStorage (storage: StorageApi) {
        // TODO dump data from current storage to new one
        this._storage = storage;
        throw new Error('Not implemented');
    }
}

const appStorage: StorageApi = new AppStorageManager(new LocalStorage());
export default appStorage;
