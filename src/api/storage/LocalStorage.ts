import { ExpensesMap, BudgetsMap, Budget, Expense, Categories, Category, ExportDataSet } from "../../interfaces";
import { SubStorageApi } from "./StorageApi";

export class LocalStorage implements SubStorageApi {
    
    private readonly KEY_BUDGETS = 'budgets';
    private readonly KEY_EXPENSES = 'expenses';
    private readonly KEY_CATEGORIES = 'categories';
    private readonly KEY_LAST_TS = 'lastTimeSaved';

    async getBudgets(): Promise<BudgetsMap> {
        const serializedBudgets = localStorage.getItem(this.KEY_BUDGETS);
        if (serializedBudgets) {
            return JSON.parse(serializedBudgets);
        }
        return {};
    }

    getExpensesSync (budgetId: string): ExpensesMap {
        const expensesKey = this.getExpensesKey(budgetId);
        const serializedExpenses = localStorage.getItem(expensesKey);
        if (serializedExpenses) {
            return JSON.parse(serializedExpenses);
        } else {
            return {};
        }
    }

    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        return this.getExpensesSync(budgetId);
    }

    async saveBudget(budget: Budget, timestamp?: number) {
        let budgets: BudgetsMap;
        try {
            budgets = await this.getBudgets();
        } catch (error) {
            budgets = {};
        }
        budgets[budget.identifier] = budget;
        this.saveBudgets(budgets);
        this.setLastTimeSaved(timestamp);
    }

    private saveBudgets(budgets: BudgetsMap, timestamp?: number) {
        localStorage.setItem(this.KEY_BUDGETS, JSON.stringify(budgets));
        this.setLastTimeSaved(timestamp);
    }

    async saveExpenses(budgetId: string, expenses: Expense[], timestamp?: number) {
        const expensesMap = await this.getExpenses(budgetId);
        expenses.forEach(e => (expensesMap[e.identifier] = e));
        const identifier = this.getExpensesKey(budgetId);
        localStorage.setItem(identifier, JSON.stringify(expensesMap));
        this.setLastTimeSaved(timestamp);
    }

    private getExpensesKey(id: string) {
        return `${this.KEY_EXPENSES}_${id}`;
    }

    async deleteExpense (budgetId: string, expenseId: string, timestamp?: number) {
        const expenses = this.getExpensesSync(budgetId);
        if (expenses && expenseId in expenses) {
            delete expenses[expenseId];
            this.saveExpenses(budgetId, Object.values(expenses));
            this.setLastTimeSaved(timestamp);
        }
    }

    async deleteBudget(budgetId: string, timestamp?: number) {
        const budgets = await this.getBudgets();
        if (budgets && budgetId in budgets) {
            delete budgets[budgetId];
            this.saveBudgets(budgets);
            localStorage.removeItem(this.getExpensesKey(budgetId));
            this.setLastTimeSaved(timestamp);
        }
    }

    async getCategories(){
        const categoriesStr = localStorage.getItem(this.KEY_CATEGORIES);
        if (categoriesStr && categoriesStr.length > 0) {
            const categories = JSON.parse(categoriesStr) as Categories;
            for (const k in categories) {
                if (!categories[k].name || !categories[k].icon) {
                    delete categories[k];
                }
            }
            return categories;
        }
        return {};
    }

    async saveCategories (categories: Categories, timestamp?: number) {
        localStorage.setItem(
            this.KEY_CATEGORIES, 
            JSON.stringify(categories));
        this.setLastTimeSaved(timestamp);
    }

    async saveCategory (category: Category, timestamp?: number) {
        const categories = await this.getCategories();
        categories[category.identifier] = category;
        return this.saveCategories(categories, timestamp);
    }

    async getLastTimeSaved() {
        const tsString = localStorage.getItem(this.KEY_LAST_TS);
        if (tsString) {
            return parseInt(tsString);
        } else {
            return 0;
        }
    }

    async setLastTimeSaved(timestamp=new Date().getTime()) {
        if (timestamp) {
            localStorage.setItem(this.KEY_LAST_TS, timestamp.toString());
        }
    }

    async import (data: ExportDataSet) {
        const budgets = await this.getBudgets();
        const categories = await this.getCategories();
        await this.saveBudgets({...budgets, ...data.budgets});
        const promises = Object
            .entries(data.expenses)
            .map(([id, e]) => this.saveExpenses(id, Object.values(e)));
        promises.push(this.saveCategories({...categories, ...data.categories}));
        promises.push(this.setLastTimeSaved(data.lastTimeSaved));
        await Promise.all(promises);
    }

    async export (): Promise<ExportDataSet> {
        const [budgets, categories, lastTimeSaved] = await Promise.all([this.getBudgets(), this.getCategories(), this.getLastTimeSaved()]);
        const expenses: {[budgetId: string]: ExpensesMap} = {};
        Object.values(budgets).forEach(async b => (expenses[b.identifier] = await this.getExpenses(b.identifier)));
        return {
            budgets, categories, lastTimeSaved, expenses
        }
    }

}
