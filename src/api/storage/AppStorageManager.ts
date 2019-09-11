import { StorageApi, SubStorageApi } from "./StorageApi";
import { Budget, Expense, Category, ExportDataSet, SyncDirection } from "../../interfaces";

export class AppStorageManager implements StorageApi {
    private _local: SubStorageApi;

    constructor (local: SubStorageApi) {
        this._local = local;
        navigator.serviceWorker.ready.then(function(swRegistration) {
            return swRegistration.sync.register('toRemote');
        });
    }

    private async notifySync () {
        const registration = await navigator.serviceWorker.ready;
        registration.sync.register(SyncDirection.LocalToRemote);
    }

    async getBudgets() {
        return this._local.getBudgets();
    }

    async getBudget(budgetId: string) {
        return this._local.getBudget(budgetId);
    }

    async getExpenses(budgetId: string) {
        return this._local.getExpenses(budgetId);
    }
    
    async saveBudget(budget: Budget, timestamp = new Date().getTime()) {
        await this._local.saveBudget(budget, timestamp);
        this.notifySync();
    }
    
    async deleteBudget(budgetId: string, timestamp = new Date().getTime()) {
        await this._local.deleteBudget(budgetId, timestamp);
        this.notifySync();
    }

    async getExpense(expenseId: string) {
        return this._local.getExpense(expenseId);
    }
    
    async saveExpenses(expenses: Expense[], timestamp = new Date().getTime()) {
        await this._local.saveExpenses(expenses, timestamp);
        this.notifySync();
    }

    async deleteExpense(expenseId: string, timestamp = new Date().getTime()) {
        await this._local.deleteExpense(expenseId, timestamp);
        this.notifySync();
    }

    async getCategories() {
        return this._local.getCategories();
    }

    async getCategory(categoryId: string) {
        return this._local.getCategory(categoryId);
    }

    async saveCategory(category: Category, timestamp = new Date().getTime()) {
        await this._local.saveCategory(category, timestamp);
        this.notifySync();
    }

    async deleteCategory(identifier: string, timestamp = new Date().getTime()) {
        await this._local.deleteCategory(identifier, timestamp);
        this.notifySync();
    }

    async export () {
        return this._local.export();
    }

    async import (data: ExportDataSet) {
        await this._local.import(data);
        this.notifySync();
    }
}
