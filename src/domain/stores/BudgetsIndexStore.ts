import { Budget, BudgetsMap, Expense } from "../../interfaces";
import { StorageObserver, AppStorageApi } from "../../services/storage/StorageApi";

export class BudgetsIndexStore implements StorageObserver {

    private _budgetsIndex?: {[identifier: string]: Budget};
    private readonly _storage: AppStorageApi;

    constructor (storage: AppStorageApi) {
        this._storage = storage;
        this._storage.addObserver(this);
    }

    onStorageDataChanged() {
        this._budgetsIndex = undefined;
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
        return this._storage.setBudget(budget);
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

    async saveExpenses(expenses: Expense[]) {
        return this._storage.setExpenses(expenses);
    }

    async deleteExpense(expenseId: string) {
        return this._storage.deleteExpense(expenseId);
    }

}
