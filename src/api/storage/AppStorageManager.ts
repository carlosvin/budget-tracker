import { StorageApi, SubStorageApi } from "./StorageApi";
import { Budget, Expense, Category, Categories } from "../../interfaces";

export class AppStorageManager implements StorageApi {
    private _local: SubStorageApi;
    private _remote?: SubStorageApi;

    constructor (local: SubStorageApi) {
        this._local = local;
    }

    async initRemote (remotePromise ?: Promise<SubStorageApi|undefined>) {
        if (remotePromise) {
            this._remote = await remotePromise;
            if (this._remote) {
                await AppStorageManager.sync(this._local, this._remote);
                return this._remote;
            }
        } else {
            this._remote = undefined;
        }
    }

    private static async sync(local: SubStorageApi, remote: SubStorageApi) {
        const [remoteTime, localTime] = await Promise.all([
            remote.getLastTimeSaved(), 
            local.getLastTimeSaved()]);
        if (remoteTime > localTime) {
            return local.import(await remote.export());
        } else if (remoteTime < localTime) {
            return remote.import(await local.export());
        } else {
            console.info('Nothing to sync');
        }
    }

    async getBudgets() {
        return this._local.getBudgets();
    }

    async getExpenses(budgetId: string) {
        return this._local.getExpenses(budgetId);
    }
    
    async saveBudget(budget: Budget, timestamp = new Date().getTime()) {
        if (this._remote) {
            this._remote.saveBudget(budget, timestamp);
        }
        return this._local.saveBudget(budget, timestamp);
    }
    
    async deleteBudget(budgetId: string, timestamp = new Date().getTime()) {
        if (this._remote) {
            this._remote.deleteBudget(budgetId, timestamp);
        }
        return this._local.deleteBudget(budgetId, timestamp);
    }
    
    async saveExpenses(budgetId: string, expenses: Expense[], timestamp = new Date().getTime()) {
        if (this._remote) {
            this._remote.saveExpenses(budgetId, expenses, timestamp);
        }
        return this._local.saveExpenses(budgetId, expenses, timestamp);
    }

    async deleteExpense(budgetId: string, expenseId: string, timestamp = new Date().getTime()) {
        if (this._remote) {
            this._remote.deleteExpense(budgetId, expenseId, timestamp);
        }
        return this._local.deleteExpense(budgetId, expenseId, timestamp);
    }

    async getCategories() {
        return this._local.getCategories();
    }

    async saveCategory(category: Category, timestamp = new Date().getTime()) {
        if (this._remote) {
            this._remote.saveCategory(category, timestamp);
        }
        return this._local.saveCategory(category, timestamp);
    }

    async saveCategories(categories: Categories, timestamp = new Date().getTime()) {
        if (this._remote) {
            this._remote.saveCategories(categories, timestamp);
        }
        return this._local.saveCategories(categories, timestamp);
    }

    async getLastTimeSaved(){
        return this._local.getLastTimeSaved();
    }

    async setLastTimeSaved(timestamp: number) {
        throw new Error('App storage manager should not implement set timestamp method');
    }
}
