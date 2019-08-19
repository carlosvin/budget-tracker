import { StorageApi } from "./StorageApi";
import { Budget, Expense, Category, Categories } from "../../interfaces";
import { LocalStorage } from "./LocalStorage";

class AppStorageManager implements StorageApi {
    private _local: StorageApi;
    private _remote?: StorageApi;

    
    constructor (local: StorageApi, remote?: StorageApi) {
        this._local = local;
        if (remote) {
            this._remote = remote;
            AppStorageManager.sync(this._local, this._remote);
        }
    }

    private static async sync(local: StorageApi, remote: StorageApi) {
        const [remoteTime, localTime] = await Promise.all([
            remote.getLastTimeSaved(), 
            local.getLastTimeSaved()]);
        if (remoteTime > localTime) {
            return AppStorageManager.dump(remote, local);
        } else if (remoteTime < localTime) {
            return AppStorageManager.dump(local, remote);
        }
    }

    private static async dump(from: StorageApi, to: StorageApi){
        throw Error('not implemented');

    }

    async getBudgets() {
        return this._local.getBudgets();
    }

    async getExpenses(budgetId: string) {
        return this._local.getExpenses(budgetId);
    }
    
    async saveBudget(budget: Budget) {
        if (this._remote) {
            this._remote.saveBudget(budget);
        }
        return this._local.saveBudget(budget);
    }
    
    async deleteBudget(budgetId: string) {
        if (this._remote) {
            this._remote.deleteBudget(budgetId);
        }
        return this._local.deleteBudget(budgetId);
    }
    
    async saveExpense(budgetId: string, expense: Expense) {
        if (this._remote) {
            this._remote.saveExpense(budgetId, expense);
        }
        return this._local.saveExpense(budgetId, expense);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        if (this._remote) {
            this._remote.deleteExpense(budgetId, expenseId);
        }
        return this._local.deleteExpense(budgetId, expenseId);
    }

    async getCategories() {
        return this._local.getCategories();
    }

    async saveCategory(category: Category) {
        if (this._remote) {
            this._remote.saveCategory(category);
        }
        return this._local.saveCategory(category);
    }

    async saveCategories(categories: Categories) {
        if (this._remote) {
            this._remote.saveCategories(categories);
        }
        return this._local.saveCategories(categories);
    }

    async getLastTimeSaved(){
        return this._local.getLastTimeSaved();
    }
}

const appStorage: StorageApi = new AppStorageManager(new LocalStorage());
export default appStorage;
