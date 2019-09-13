import { StorageApi, SubStorageApi } from "./StorageApi";
import { Budget, Expense, Category, ExportDataSet } from "../../interfaces";

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
            console.debug('Remote > Local');
            return local.import(await remote.export());
        } else if (remoteTime < localTime) {
            console.debug('Local > Remote');
            return remote.import(await local.export());
        } else {
            console.debug('Nothing to sync');
        }
        console.debug('Sync done');
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
    
    async saveBudget(budget: Budget, timestamp = new Date().getTime()) {
        const localPromise = this._local.saveBudget(budget, timestamp);
        if (this._remote) {
            this._remote.saveBudget(budget, timestamp);
        }
        return localPromise;
    }
    
    async deleteBudget(budgetId: string, timestamp = new Date().getTime()) {
        const localPromise = this._local.deleteBudget(budgetId, timestamp);
        if (this._remote) {
            this._remote.deleteBudget(budgetId, timestamp);
        }
        return localPromise;
    }

    async getExpense(expenseId: string) {
        return this._local.getExpense(expenseId);
    }
    
    async saveExpenses(expenses: Expense[], timestamp = new Date().getTime()) {
        const localPromise = this._local.saveExpenses(expenses, timestamp);
        if (this._remote) {
            this._remote.saveExpenses(expenses, timestamp);
        }
        return localPromise;
    }

    async deleteExpense(expenseId: string, timestamp = new Date().getTime()) {
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

    async saveCategory(category: Category, timestamp = new Date().getTime()) {
        const localPromise = this._local.saveCategory(category, timestamp);
        if (this._remote) {
            this._remote.saveCategory(category, timestamp);
        }
        return localPromise;
    }

    async deleteCategory(identifier: string, timestamp = new Date().getTime()) {
        const localPromise = this._local.deleteCategory(identifier, timestamp);
        if (this._remote) {
            this._remote.deleteCategory(identifier, timestamp);
        }
        return localPromise;
    }

    async export () {
        return this._local.export();
    }

    async import (data: ExportDataSet) {
        const localPromise = this._local.import(data);
        if (this._remote) {
            this._remote.import(data);
        }
        return localPromise;
    }
}
