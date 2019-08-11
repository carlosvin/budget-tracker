import { Budget, BudgetsMap, Expense } from "../interfaces";
import { StorageApi } from "../api/storage/StorageApi";

export class BudgetsIndexStore {

    private _budgetsIndex?: {[identifier: string]: Budget};
    private readonly _storage: StorageApi;

    constructor (storage: StorageApi) {
        this._storage = storage;
    }

    async getBudgetsIndex (): Promise<BudgetsMap> {
        if (!this._budgetsIndex) {
            try {
                this._budgetsIndex = await this._storage.getBudgets();
            } catch (error) {
                console.warn(error, ', setting empty index');
                this._budgetsIndex = {};
            }
        }
        return this._budgetsIndex;
    }

    async getBudgetInfo(identifier: string) {
        const budgetsIndex = await this.getBudgetsIndex();
        if (identifier in budgetsIndex) {
            return budgetsIndex[identifier];
        }
        throw new Error(`Budget nof found: ${identifier}`);
    }

    async setBudgetInfo (budget: Budget) {
        if (!this._budgetsIndex) {
            this._budgetsIndex = await this.getBudgetsIndex();
        }
        if (this._budgetsIndex) {
            this._budgetsIndex[budget.identifier] = budget;
        }
        return this._storage.saveBudget(budget);
    }

    async deleteBudget(budgetId: string) {
        if (this._budgetsIndex && budgetId in this._budgetsIndex) {
            delete this._budgetsIndex[budgetId];
        }
        return this._storage.deleteBudget(budgetId);
    }

    async getExpenses(budgetId: string){
        return this._storage.getExpenses(budgetId);
    }

    async saveExpense(budgetId: string, expense: Expense) {
        return this._storage.saveExpense(budgetId, expense);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        return this._storage.deleteExpense(budgetId, expenseId);
    }

}
