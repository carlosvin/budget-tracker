import { Budget, Expense, ExportDataSet } from "../../interfaces";
import { BudgetModel } from "../BudgetModel";
import { BudgetsStore } from "./interfaces";
import { btApp } from "../../BudgetTracker";
import { AppStorageApi, StorageObserver } from "../../services/storage/StorageApi";
import { BudgetModelImpl } from "../BudgetModelImpl";

export class BudgetsStoreImpl implements BudgetsStore, StorageObserver {

    private _budgetModels: {[identifier: string]: BudgetModel};
    private readonly _storage: AppStorageApi;

    constructor (storage: AppStorageApi) {
        this._storage = storage;
        this._storage.addObserver(this);
        this._budgetModels = {};
    }

    onStorageDataChanged () {
        this._budgetModels = {};
    }

    async getBudgetInfo (budgetId: string) {
        return this._storage.getBudget(budgetId);
    }

    async getBudgetsIndex(){
        return this._storage.getBudgets();
    }

    async getBudgetModel(budgetId: string) {
        if (!(budgetId in this._budgetModels)) {
            const [budget, expenses] = await Promise.all([
                this._storage.getBudget(budgetId),
                this._storage.getExpenses(budgetId)
            ]);
            if (budget) {
                this._budgetModels[budgetId] = new BudgetModelImpl(
                    budget,
                    expenses
                );
            } else {
                throw new Error('Budget not found: ' + budgetId);
            }
            
        }
        return this._budgetModels[budgetId];
    }

    async setBudget(budget: Budget) {
        if (budget.identifier in this._budgetModels) {
            const budgetModel = this._budgetModels[budget.identifier];
            let rates = undefined;
            if (budgetModel.currency !== budget.currency) {
                rates = await (await btApp.getCurrenciesStore()).getRates(budget.currency);
            }
            await budgetModel.setBudget(budget, rates);
        } else {
            this._budgetModels[budget.identifier] = new BudgetModelImpl(budget, {});
        }
        return this._storage.setBudget(budget); 
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
        this._storage.setExpenses(expenses);
    }

    async getExpense(budgetId: string, expenseId: string){
        return (await this.getBudgetModel(budgetId)).getExpense(expenseId);
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
        return this._storage.deleteExpense(expenseId);
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
        return this._storage.setExpenses([expense]);
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
