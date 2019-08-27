import { StorageApi } from "./StorageApi";
import { Budget, Expense, Category, Categories } from "../../interfaces";

export class AppStorageManager implements StorageApi {
    private _local: StorageApi;
    private _remote?: StorageApi;

    constructor (local: StorageApi) {
        this._local = local;
    }

    async initRemote (remotePromise ?: Promise<StorageApi|undefined>) {
        if (remotePromise) {
            this._remote = await remotePromise;
            if (this._remote) {
                await AppStorageManager.sync(this._local, this._remote);
            }
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
        } else {
            console.info('Nothing to sync');
        }
    }

    private static async dump(from: StorageApi, to: StorageApi) {
        await to.saveCategories(await from.getCategories());
        const budgets = Object.values(await from.getBudgets());
        await Promise.all(budgets.map(budget => to.saveBudget(budget)));
        for (const budget of budgets) {
            const expenses = await from.getExpenses(budget.identifier);
            await to.saveExpenses(budget.identifier, Object.values(expenses));
        }
        return to.setLastTimeSaved(await from.getLastTimeSaved());
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
    
    async saveExpenses(budgetId: string, expenses: Expense[]) {
        if (this._remote) {
            this._remote.saveExpenses(budgetId, expenses);
        }
        return this._local.saveExpenses(budgetId, expenses);
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

    async setLastTimeSaved(timestamp = new Date().getTime()) {
        return this._local.setLastTimeSaved(timestamp);
    }
}
