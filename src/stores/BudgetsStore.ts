import { Budget, Expense } from "../interfaces";
import { BudgetModel } from "../BudgetModel";
import { StorageApi } from "../api/StorageApi";
import { LocalStorage } from "../api/LocalStorage";

export class BudgetsStore {

    private _budgetModels: {[identifier: string]: BudgetModel};
    private _budgetsIndex?: {[identifier: string]: Budget};
    private readonly storage: StorageApi;

    constructor(storage = new LocalStorage()){
        console.log('Instantiate store');
        this.storage = storage;
        this._budgetModels = {};
    }

    async getBudgetsIndex () {
        if (!this._budgetsIndex) {
            try {
                this._budgetsIndex = await this.storage.getBudgets();
            } catch (error) {
                console.warn(error, ', setting empty index');
                this._budgetsIndex = {};
            }
        }
        return this._budgetsIndex;
    }

    async getBudgetModel(budgetId: string) {
        if (!(budgetId in this._budgetModels)) {
            const [budget, expenses] = await Promise.all([
                this.getBudgetInfo(budgetId),
                this.storage.getExpenses(budgetId)
            ]);
            this._budgetModels[budgetId] = new BudgetModel(
                budget,
                expenses
            );
        }
        return this._budgetModels[budgetId];
    }

    async getBudgetInfo(identifier: string) {
        const budgetsIndex = await this.getBudgetsIndex();
        if (identifier in budgetsIndex) {
            return budgetsIndex[identifier];
        }
        throw new Error(`Budget nof found: ${identifier}`);
    }

    async setBudget(budget: Budget) {
        if (budget.identifier in this._budgetModels) {
            this._budgetModels[budget.identifier].setBudget(budget);
        }
        return this.storage.saveBudget(budget);
    }

    async getExpenses(budgetId: string) {
        const budgetModel = await this.getBudgetModel(budgetId);
        return budgetModel.expenses;
    }

    async setExpense(budgetId: string, expense: Expense){
        const model = await this.getBudgetModel(budgetId);
        model.setExpense(expense);
        return this.storage.saveExpense(budgetId, expense);      
    }

    async deleteBudget(budgetId: string) {
        if (budgetId in this._budgetModels) {
            delete this._budgetModels[budgetId];
        }
        return this.storage.deleteBudget(budgetId);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        const model = await this.getBudgetModel(budgetId);
        model.deleteExpense(expenseId);
        return this.storage.deleteExpense(budgetId, expenseId);
    }

}

export const budgetsStore = new BudgetsStore();
