import { Budget, Expense, ExportDataSet, BudgetTracker, YMD } from "../../api";
import { BudgetModel } from "../BudgetModel";
import { BudgetsStore } from ".";
import { AppStorageApi, StorageObserver } from "../../services";
import { BudgetModelImpl } from "../BudgetModelImpl";

export class BudgetsStoreImpl implements BudgetsStore, StorageObserver {

    private _budgetModels: Map<string, BudgetModel>;
    private readonly _app: BudgetTracker;
    private readonly _storage: AppStorageApi;

    constructor (app: BudgetTracker) {
        this._budgetModels = new Map();
        this._app = app;
        this._storage = app.storage;
        this._storage.addObserver(this);
    }

    onStorageDataChanged () {
        this._budgetModels.clear();
    }

    async getBudgetsIndex(){
        return this._storage.getBudgets();
    }

    async getBudgetModel(budgetId: string) {
        let bm = this._budgetModels.get(budgetId);
        if (bm === undefined) {
            const budget = await this._storage.getBudget(budgetId);
            const expenses = await this._storage.getExpenses(budgetId);
            if (budget) {
                bm = new BudgetModelImpl(budget, Object.values(expenses));
                this._budgetModels.set(budgetId, bm);
            } else {
                throw new Error('Budget not found: ' + budgetId);
            }
        }
        return bm;
    }

    async setBudget(budget: Budget) {
        const budgetModel = this._budgetModels.get(budget.identifier);
        if (budgetModel) {
            let rates = undefined;
            if (budgetModel.currency !== budget.currency) {
                rates = await (await this._app.getCurrenciesStore()).getRates(budget.currency);
            }
            await budgetModel.setBudget(budget, rates);
        } else {
            this._budgetModels.set(budget.identifier, new BudgetModelImpl(budget));
        }
        return this._storage.setBudget(budget); 
    }

    async getExpenses(budgetId: string) {
        return (await this.getBudgetModel(budgetId)).expenses;
    }

    async getExpensesByDay(budgetId: string, date: YMD) {
        const budgetModel = await this.getBudgetModel(budgetId);
        const expenses = budgetModel.expenseGroupsIn.getExpenses(date);
        if (expenses) {
            return expenses;
        }
        throw new Error('No expenses found');
    }

    async setExpenses(budgetId: string, expenses: Expense[]) {
        const model = await this.getBudgetModel(budgetId);
        for (const expense of expenses) {
            const oldExpense = await this._storage.getExpense(expense.identifier);
            // Check if expense was moved to other budget
            if (oldExpense && oldExpense.budgetId !== budgetId) {
                const oldModel = await this.getBudgetModel(oldExpense.budgetId);
                oldModel && oldModel.deleteExpense(expense.identifier);
            }
            model.setExpense(expense);
        }
        return this._storage.setExpenses(expenses);
    }

    async getExpense(budgetId: string, expenseId: string){
        return (await this.getBudgetModel(budgetId)).getExpense(expenseId);
    }

    async deleteBudget(budgetId: string) {
        this._budgetModels.delete(budgetId);
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
            for (const e of bm.expenses) {
                data.expenses[e.identifier] = e.info;
            }
        }
        return data;
    }
}
