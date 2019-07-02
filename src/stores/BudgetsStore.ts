import { Budget, Expense } from "../interfaces";
import { BudgetModel } from "../BudgetModel";
import { StorageApi, appStorage } from "../api/StorageApi";

export class BudgetsStore {

    private _budgetModels: {[identifier: string]: BudgetModel};
    private _budgetsIndex?: {[identifier: string]: Budget};
    private readonly storage: StorageApi;

    constructor(){
        console.log('Instantiate store');
        this._budgetModels = {};
        this.storage = appStorage;
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
                appStorage.getExpenses(budgetId)
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
        const budgets = await this.getBudgetsIndex()
        budgets[budget.identifier] = budget;
        await this.storage.saveBudgets(budgets);
    }

    async getExpenses(budgetId: string) {
        const budgetModel = await this.getBudgetModel(budgetId);
        return budgetModel.expenses;
    }

    async setExpense(budgetId: string, expense: Expense){
        const model = await this.getBudgetModel(budgetId);
        model.setExpense(expense);
        this.storage.saveExpenses(budgetId, model.expenses);      
    }

    async deleteBudget(budgetId: string) {
        if (budgetId in this._budgetModels) {
            delete this._budgetModels[budgetId];
        }
        return appStorage.deleteBudget(budgetId);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        const model = await this.getBudgetModel(budgetId);
        model.deleteExpense(expenseId);
        return appStorage.deleteExpense(budgetId, expenseId);
    }

}

export const budgetsStore = new BudgetsStore();
