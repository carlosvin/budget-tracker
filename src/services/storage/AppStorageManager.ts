import { SubStorageApi, AppStorageApi } from "./StorageApi";
import { Budget, Expense, Category } from "../../interfaces";
import { DataSync } from "./DataSync";

export class AppStorageManager implements AppStorageApi {
    private _local: SubStorageApi;
    private _remote?: SubStorageApi;

    constructor (local: SubStorageApi) {
        this._local = local;
    }
    
    subscribe(onStorageUpdated: () => void): () => void {
        throw Error('not implemented');
    }

    async setRemote (remote?: SubStorageApi) {
        if (this._remote !== remote) {
            this._remote = remote;
            if (this._remote) {
                return this.sync();
            }
        }
    }

    async sync () {
        if (this._remote) {
            const [
                remoteTime, 
                localTime
            ] = await Promise.all([
                this._remote.getLastTimeSaved(), 
                this._local.getLastTimeSaved()
            ]);
                if (remoteTime > localTime) {
                    console.debug('Remote > Local');
                    await new DataSync(this._remote, this._local).sync();
                } else if (remoteTime < localTime) {
                    console.debug('Local > Remote');
                    await new DataSync(this._local, this._remote).sync();
                } else {
                    console.debug('Nothing to sync');
                }
                console.debug('Sync done');    
        }
    }

    async getBudget(budgetId: string) {
        return this._local.getBudget(budgetId);
    }

    async getBudgets() {
        return this._local.getBudgets();
    }

    async getExpenses(budgetId: string) {
        return this._local.getExpenses(budgetId);
    }
    
    async setBudget(budget: Budget, timestamp = Date.now()) {
        const localPromise = this._local.setBudget(budget, timestamp);
        if (this._remote) {
            this._remote.setBudget(budget, timestamp);
        }
        return localPromise;
    }
    
    async deleteBudget(budgetId: string, timestamp = Date.now()) {
        const localPromise = this._local.deleteBudget(budgetId, timestamp);
        if (this._remote) {
            this._remote.deleteBudget(budgetId, timestamp);
        }
        return localPromise;
    }

    async getExpense(expenseId: string) {
        return this._local.getExpense(expenseId);
    }
    
    async setExpenses(expenses: Expense[], timestamp = Date.now()) {
        const localPromise = this._local.setExpenses(expenses, timestamp);
        if (this._remote) {
            this._remote.setExpenses(expenses, timestamp);
        }
        return localPromise;
    }

    async deleteExpense(expenseId: string, timestamp = Date.now()) {
        const localPromise = this._local.deleteExpense(expenseId, timestamp);
        if (this._remote) {
            this._remote.deleteExpense(expenseId, timestamp);
        }
        return localPromise;
    }

    async getCategory(categoryId: string) {
        return this._local.getCategory(categoryId);
    }

    async getCategories() {
        return this._local.getCategories();
    }

    async setCategories(categories: Category[], timestamp = Date.now()) {
        const localPromise = this._local.setCategories(categories, timestamp);
        if (this._remote) {
            this._remote.setCategories(categories, timestamp);
        }
        return localPromise;
    }

    async deleteCategory(identifier: string, timestamp = Date.now()) {
        const localPromise = this._local.deleteCategory(identifier, timestamp);
        if (this._remote) {
            this._remote.deleteCategory(identifier, timestamp);
        }
        return localPromise;
    }
}
