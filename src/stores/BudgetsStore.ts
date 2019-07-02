import { Budget, Expense } from "../interfaces";
import { BudgetModel } from "../BudgetModel";
import { StorageApi, appStorage } from "../api/StorageApi";

export class BudgetsStore {

    private budgetModels: {[identifier: string]: BudgetModel};
    private _budgetsIndex?: {[identifier: string]: Budget};
    private readonly storage: StorageApi;

    constructor(){
        console.log('Instantiate store');
        this.budgetModels = {};
        this.storage = appStorage;
    }

    async getBudgetsIndex () {
        if (!this._budgetsIndex) {
            this._budgetsIndex = await this.storage.getBudgets();
        }
        if (this._budgetsIndex) {
            return this._budgetsIndex;
        }
        throw new Error('Cannot load budgets');
    }

    async getBudgetModel(identifier: string) {
        if (!(identifier in this.budgetModels)) {
            const [budget, expenses] = await Promise.all([
                this.getBudgetInfo(identifier),
                this.getExpenses(identifier)
            ]);
            this.budgetModels[identifier] = new BudgetModel(
                budget,
                expenses
            );
        }
        return this.budgetModels[identifier];
    }

    async getBudgetInfo(identifier: string) {
        const budgetsIndex = await this.getBudgetsIndex();
        if (identifier in this.getBudgetsIndex()) {
            return budgetsIndex[identifier];
        }
        throw new Error(`Budget nof found: ${identifier}`);
    }

    async setBudget(budget: Budget) {
        const budgets = await this.getBudgetsIndex();
        if (budget.identifier in budgets && 
            budgets[budget.identifier].currency !== budget.currency) {
            // currency was changed, so we have to recalculate expenses base amount
            const model = await this.getBudgetModel(budget.identifier);
            await model.setBudget(budget);
        }
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
        const model = await this.getBudgetModel(budgetId);
        delete this.budgetModels[budgetId];
        appStorage.deleteBudget(budgetId);
    }

}

export const budgetsStore = new BudgetsStore();
