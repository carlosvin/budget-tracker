import { SubStorageApi, AppStorageApi, StorageObserver } from "./StorageApi";
import { Budget, Expense, Category } from "../../api";
import { DataSync } from "./DataSync";

export class AppStorageManager implements AppStorageApi {
    private local: SubStorageApi;
    private remote?: SubStorageApi;
    private observers: Set<StorageObserver>;

    constructor (local: SubStorageApi) {
        AppStorageManager.persist();
        this.local = local;
        this.observers = new Set();
    }

    addObserver(observer: StorageObserver) {
        this.observers.add(observer);
    }

    deleteObserver(observer: StorageObserver) {
        this.observers.delete(observer);
    }

    private notifyObservers () {
        this.observers.forEach(o=>o.onStorageDataChanged());
    }
    
    async setRemote (remote?: SubStorageApi) {
        if (this.remote !== remote) {
            this.remote = remote;
            if (this.remote) {
                return this.sync();
            }
        }
    }

    async sync () {
        if (this.remote) {
            const [
                remoteTime, 
                localTime
            ] = await Promise.all([
                this.remote.getLastTimeSaved(), 
                this.local.getLastTimeSaved()
            ]);
            
            if (remoteTime > localTime) {
                await new DataSync(this.remote, this.local).sync();
            } else if (remoteTime < localTime) {
                await new DataSync(this.local, this.remote).sync();
            } else {
                console.debug('Nothing to sync');
                return;
            }
            this.notifyObservers();
            console.debug('Sync done');
        }
    }

    async getBudget(budgetId: string) {
        return this.local.getBudget(budgetId);
    }

    async getBudgets() {
        return this.local.getBudgets();
    }

    async getExpenses(budgetId: string) {
        return this.local.getExpenses(budgetId);
    }
    
    async setBudget(budget: Budget, timestamp = Date.now()) {
        const localPromise = this.local.setBudget(budget, timestamp);
        if (this.remote) {
            this.remote.setBudget(budget, timestamp);
        }
        return localPromise;
    }
    
    async deleteBudget(budgetId: string, timestamp = Date.now()) {
        const localPromise = this.local.deleteBudget(budgetId, timestamp);
        if (this.remote) {
            this.remote.deleteBudget(budgetId, timestamp);
        }
        return localPromise;
    }

    async getExpense(expenseId: string) {
        return this.local.getExpense(expenseId);
    }
    
    async setExpenses(expenses: Expense[], timestamp = Date.now()) {
        const localPromise = this.local.setExpenses(expenses, timestamp);
        if (this.remote) {
            this.remote.setExpenses(expenses, timestamp);
        }
        return localPromise;
    }

    async deleteExpense(expenseId: string, timestamp = Date.now()) {
        const localPromise = this.local.deleteExpense(expenseId, timestamp);
        if (this.remote) {
            this.remote.deleteExpense(expenseId, timestamp);
        }
        return localPromise;
    }

    async getCategory(categoryId: string) {
        return this.local.getCategory(categoryId);
    }

    async getCategories() {
        return this.local.getCategories();
    }

    async setCategories(categories: Category[], timestamp = Date.now()) {
        const localPromise = this.local.setCategories(categories, timestamp);
        if (this.remote) {
            this.remote.setCategories(categories, timestamp);
        }
        return localPromise;
    }

    async deleteCategory(identifier: string, timestamp = Date.now()) {
        const localPromise = this.local.deleteCategory(identifier, timestamp);
        if (this.remote) {
            this.remote.deleteCategory(identifier, timestamp);
        }
        return localPromise;
    }

    static async persist() {
        const {storage} = navigator;
        if (storage && storage.persist && await storage.persist()) {
            console.info("Storage will not be cleared except by explicit user action");
        } else {
            console.warn("Storage may be cleared by the UA under storage pressure.")
        }
    }

    static async isPersisted () {
        const {storage} = navigator;
        return storage && storage.persist && storage.persisted();
    }
}
