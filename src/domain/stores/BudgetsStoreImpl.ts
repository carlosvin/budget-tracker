import { Budget, Expense, ExportDataSet, BudgetTracker, YMD } from "../../api";
import { BudgetModel } from "../BudgetModel";
import { BudgetsStore } from "./interfaces";
import { AppStorageApi, StorageObserver } from "../../services/storage/StorageApi";
import { BudgetModelImpl } from "../BudgetModelImpl";

export class BudgetsStoreImpl implements BudgetsStore, StorageObserver {

    private _budgetModels: {[identifier: string]: BudgetModel};
    private readonly _app: BudgetTracker;
    private readonly _storage: AppStorageApi;

    constructor (app: BudgetTracker) {
        this._budgetModels = {};
        this._app = app;
        this._storage = app.storage;
        this._storage.addObserver(this);
    }

    onStorageDataChanged () {
        this._budgetModels = {};
    }

    async getBudgetsIndex(){
        return this._storage.getBudgets();
    }

    async getBudgetModel(budgetId: string) {
        if (!(budgetId in this._budgetModels)) {
            const budget = await this._storage.getBudget(budgetId);
            const expenses = await this._storage.getExpenses(budgetId);
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
                rates = await (await this._app.getCurrenciesStore()).getRates(budget.currency);
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

    async getExpensesByDay(budgetId: string, date: YMD) {
        const budgetModel = await this.getBudgetModel(budgetId);
        if (budgetModel.expenseGroups) {
            const expenses = budgetModel.expenseGroups.getExpenses(date);
            if (expenses) {
                return expenses;
            }
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
        return this._storage.setExpenses([expense]);
    }

    async import(data: ExportDataSet) {
        const {budgets, expenses, categories} = data;
        // Keep BC compatibility Category.id -> Category.identifier
        const fixedCategories = Object
            .entries(categories)
            .map(([identifier, c]) => ({identifier, ...c}));
        await Promise.all([
            this.setBudgets(Object.values(budgets)), 
            this.setExpensesList(Object.values(expenses)), 
            (await this._app.getCategoriesStore()).setCategories(fixedCategories)
        ]);
    }

    async export() {
        const data: ExportDataSet = {
            budgets: {},
            expenses: {},
            categories: await (await this._app.getCategoriesStore()).getCategories(),
            lastTimeSaved: Date.now()
        };
        const budgets = await Promise.all(Object.keys(await this.getBudgetsIndex()).map(id => this.getBudgetModel(id)));
        for (const bm of budgets) {
            data.budgets[bm.identifier] = bm.info;
            for (const e of Object.values(bm.expenses)) {
                data.expenses[e.identifier] = e.info;
            }
        }
        return data;
    }
}
