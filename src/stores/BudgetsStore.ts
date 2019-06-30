import { Budget, Expense } from "../interfaces";
import { BudgetModel } from "../BudgetModel";

export class BudgetsStore {

    static readonly KEY_BUDGETS = 'budgets';
    static readonly KEY_EXPENSES = 'expenses';

    private budgetModels: {[identifier: string]: BudgetModel};
    private _budgetsIndex?: {[identifier: string]: Budget};

    constructor(){
        console.log('Instantiate store');
        this.budgetModels = {};
    }

    get budgetIndex () {
        if (!this._budgetsIndex) {
            this._budgetsIndex = this.fetchBudgets();
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
                this.fetchExpenses(identifier)
            ]);
            this.budgetModels[identifier] = new BudgetModel(
                budget,
                expenses
            );
        }
        return this.budgetModels[identifier];
    }

    getBudgetInfo(identifier: string): Budget {
        if (identifier in this.budgetIndex) {
            return this.budgetIndex[identifier];
        }
        throw new Error(`Budget nof found: ${identifier}`);
    }

    async setBudget(budget: Budget) {
        const budgets = this.budgetIndex;
        if (budget.identifier in budgets && 
            budgets[budget.identifier].currency !== budget.currency) {
            // currency was changed, so we have to recalculate expenses base amount
            const model = await this.getBudgetModel(budget.identifier);
            await model.setBudget(budget);
        }
        budgets[budget.identifier] = budget;
        await this.saveBudgets();
    }

    async getExpenses(budgetId: string) {
        const budgetModel = await this.getBudgetModel(budgetId);
        return budgetModel.expenses;
    }

    async getExpense(budgetId: string, expenseId: string): Promise<Expense> {
        const budgetModel = await this.getBudgetModel(budgetId);
        return budgetModel.getExpense(expenseId);
    }

    async deleteExpense (budgetId: string, expenseId: string) {
        const budgetModel = await this.getBudgetModel(budgetId);
        budgetModel.deleteExpense(expenseId);
        this.saveExpenses(budgetId, budgetModel.expenses);
    }

    async deleteBudget (budgetId: string) {
        if (this._budgetsIndex && budgetId in this._budgetsIndex) {
            delete this._budgetsIndex[budgetId];
            delete this.budgetModels[budgetId];
            this.saveBudgets();
            localStorage.removeItem(this.getExpensesKey(budgetId));
        }
    }

    private getExpensesKey(id: string) {
        return `${BudgetsStore.KEY_EXPENSES}_${id}`;
    }

    async setExpense(budgetId: string, expense: Expense){
        const model = await this.getBudgetModel(budgetId);
        model.setExpense(expense);
        this.saveExpenses(budgetId, model.expenses);      
    }

    saveExpenses (budgetId: string, expenses: {[identifier: string]: Expense}) {
        localStorage.setItem(
            this.getExpensesKey(budgetId), 
            JSON.stringify(expenses));
    }

    private fetchExpenses(budgetId: string): {[id: string] : Expense} {
        const expensesKey = this.getExpensesKey(budgetId);
        const serializedExpenses = localStorage.getItem(expensesKey);
        if (serializedExpenses) {
            return JSON.parse(serializedExpenses);
        } else {
            return {};
        }
    }

    private fetchBudgets(): {[id: string]: Budget} {
        const serializedBudgets = localStorage.getItem(BudgetsStore.KEY_BUDGETS);
        if (serializedBudgets) {
            return JSON.parse(serializedBudgets);
        }
        return {};
    }

    private async saveBudgets () {
        if (this.budgetIndex) {
            localStorage.setItem(BudgetsStore.KEY_BUDGETS, this.serializedBudgets);
        }
    }

    private get serializedBudgets () {
        return JSON.stringify(this.budgetIndex);
    }

}

export const budgetsStore = new BudgetsStore();
