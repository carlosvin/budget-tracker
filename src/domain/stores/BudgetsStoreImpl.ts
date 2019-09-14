import { Budget, Expense, ExportDataSet } from "../../interfaces";
import { BudgetModel } from "../BudgetModel";
import { BudgetsIndexStore } from "./BudgetsIndexStore";
import { BudgetsStore } from "./interfaces";
import { btApp } from "../../BudgetTracker";

export class BudgetsStoreImpl implements BudgetsStore {

    private readonly _budgetsIndex: BudgetsIndexStore;
    private _budgetModels: {[identifier: string]: BudgetModel};

    constructor (budgetsIndex: BudgetsIndexStore) {
        this._budgetsIndex = budgetsIndex;
        this._budgetModels = {};
    }

    async getBudgetModel(budgetId: string) {
        if (!(budgetId in this._budgetModels)) {
            const [budget, expenses] = await Promise.all([
                this._budgetsIndex.getBudgetInfo(budgetId),
                this._budgetsIndex.getExpenses(budgetId)
            ]);
            this._budgetModels[budgetId] = new BudgetModel(
                budget,
                expenses
            );
        }
        return this._budgetModels[budgetId];
    }

    async setBudget(budget: Budget) {
        if (budget.identifier in this._budgetModels) {
            const budgetInfo = await this._budgetsIndex.getBudgetInfo(budget.identifier);
            let rates = undefined;
            if (budgetInfo.currency !== budget.currency) {
                rates = await (await btApp.getCurrenciesStore()).getRates(budget.currency);
            }
            this._budgetModels[budget.identifier].setBudget(budget, rates);
        } else {
            this._budgetModels[budget.identifier] = new BudgetModel(budget, {});
        }
        return this._budgetsIndex.setBudgetInfo(budget); 
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

    async setExpenses(budgetId: string, expenses: Expense[]) {
        const model = await this.getBudgetModel(budgetId);
        for (const expense of expenses) {
            model.setExpense(expense);
        }
        this._budgetsIndex.saveExpenses(expenses);
    }

    async getExpense(budgetId: string, expenseId: string){
        return (await this.getBudgetModel(budgetId)).getExpense(expenseId);
    }

    async deleteBudget(budgetId: string) {
        if (budgetId in this._budgetModels) {
            delete this._budgetModels[budgetId];
        }
        return this._budgetsIndex.deleteBudget(budgetId);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        const model = await this.getBudgetModel(budgetId);
        model.deleteExpense(expenseId);
        return this._budgetsIndex.deleteExpense(expenseId);
    }

    private async setBudgets(budgets: Budget[]) {
        return Promise.all(budgets.map(b => this.setBudget(b)));
    }

    private async setExpensesList(expenses: Expense[]) {
        return Promise.all(expenses.map(expense => this.setExpense(expense)));
    }

    private async setExpense(expense: Expense) {
        const model = await this.getBudgetModel(expense.budgetId);
        model.setExpense(expense);
        // TODO change save to set, and add setExpense method
        this._budgetsIndex.saveExpenses([expense]);
    }

    async import(data: ExportDataSet) {
        const {budgets, expenses, categories} = data;

        await Promise.all([
            this.setBudgets(Object.values(budgets)), 
            this.setExpensesList(Object.values(expenses)), 
            (await btApp.getCategoriesStore()).setCategories(Object.values(categories))
        ]);
    }

    async export(){
        const data: ExportDataSet = {
            budgets: {},
            expenses: {},
            categories: await (await btApp.getCategoriesStore()).getCategories(),
            lastTimeSaved: Date.now()
        };
        for (const bm of Object.values(this._budgetModels)) {
            data.budgets[bm.identifier] = bm.info;
            for (const e of Object.values(bm.expenses)) {
                data.expenses[e.identifier] = e;
            }
        }
        return data;
    }
}
