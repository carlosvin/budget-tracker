import { Budget, Expense, BudgetsMap } from "../interfaces";
import { BudgetModel } from "../BudgetModel";
import { StorageApi } from "../api/storage/StorageApi";
import { CurrenciesStore } from "./CurrenciesStore";

export class BudgetsStore {

    private _budgetModels: {[identifier: string]: BudgetModel};
    private _budgetsIndex?: {[identifier: string]: Budget};
    private readonly _storage: StorageApi;
    private readonly _currenciesStore: CurrenciesStore;

    constructor (storage: StorageApi, currenciesStore: CurrenciesStore) {
        this._storage = storage;
        this._currenciesStore = currenciesStore;
        this._budgetModels = {};
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

    async getBudgetModel(budgetId: string) {
        if (!(budgetId in this._budgetModels)) {
            const [budget, expenses] = await Promise.all([
                this.getBudgetInfo(budgetId),
                this._storage.getExpenses(budgetId)
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

    private async setBudgetInfo (budget: Budget) {
        if (!this._budgetsIndex) {
            this._budgetsIndex = await this.getBudgetsIndex();
        }
        if (this._budgetsIndex) {
            this._budgetsIndex[budget.identifier] = budget;
        }
    }

    async setBudget(budget: Budget) {
        if (budget.identifier in this._budgetModels) {
            const budgetInfo = await this.getBudgetInfo(budget.identifier);
            let rates = undefined;
            if (budgetInfo.currency !== budget.currency) {
                rates = await this._currenciesStore.getRates(budget.currency);
            }
            this.setBudgetInfo(budget); 
            this._budgetModels[budget.identifier].setBudget(budget, rates);
        }
        return this._storage.saveBudget(budget);
    }

    async getExpenses(budgetId: string) {
        const budgetModel = await this.getBudgetModel(budgetId);
        return budgetModel.expenses;
    }

    async getExpensesByDay(budgetId: string, y: number, m: number, d: number) {
        const budgetModel = await this.getBudgetModel(budgetId);
        if (budgetModel.expenseGroups) {
            return budgetModel.expenseGroups[y][m][d];
        }
        throw new Error('No expenses found');
    }

    async setExpense(budgetId: string, expense: Expense){
        const model = await this.getBudgetModel(budgetId);
        model.setExpense(expense);
        return this._storage.saveExpense(budgetId, expense);      
    }

    async deleteBudget(budgetId: string) {
        if (budgetId in this._budgetModels) {
            delete this._budgetModels[budgetId];
        }
        return this._storage.deleteBudget(budgetId);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        const model = await this.getBudgetModel(budgetId);
        model.deleteExpense(expenseId);
        return this._storage.deleteExpense(budgetId, expenseId);
    }
}
