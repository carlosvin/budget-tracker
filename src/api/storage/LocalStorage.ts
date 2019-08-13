import { ExpensesMap, BudgetsMap, Budget, Expense, Categories, Category } from "../../interfaces";
import { StorageApi } from "./StorageApi";

export class LocalStorage implements StorageApi {
    
    private readonly KEY_BUDGETS = 'budgets';
    private readonly KEY_EXPENSES = 'expenses';
    private readonly KEY_CATEGORIES = 'categories';

    async getBudgets(): Promise<BudgetsMap> {
        const serializedBudgets = localStorage.getItem(this.KEY_BUDGETS);
        if (serializedBudgets) {
            return JSON.parse(serializedBudgets);
        }
        throw new Error('Error fetching budgets');
    }

    getExpensesSync (budgetId: string) {
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

    async saveBudget(budget: Budget) {

        let budgets: BudgetsMap;
        try {
            budgets = await this.getBudgets();
        } catch (error) {
            budgets = {};
        }
        budgets[budget.identifier] = budget;
        this.saveBudgets(budgets);
    }

    saveBudgets(budgets: BudgetsMap) {
        localStorage.setItem(this.KEY_BUDGETS, JSON.stringify(budgets));
    }


    async saveExpense (budgetId: string, expense: Expense) {
        const expenses = await this.getExpenses(budgetId);
        expenses[expense.identifier] = expense;
        return this.saveExpenses(budgetId, expenses);
    }

    async saveExpenses(budgetId: string, expenses: ExpensesMap) {
        const identifier = this.getExpensesKey(budgetId);
        localStorage.setItem(identifier, JSON.stringify(expenses));
    }

    private getExpensesKey(id: string) {
        return `${this.KEY_EXPENSES}_${id}`;
    }

    async deleteExpense (budgetId: string, expenseId: string) {
        const expenses = this.getExpensesSync(budgetId);
        if (expenses && expenseId in expenses) {
            delete expenses[expenseId];
            this.saveExpenses(budgetId, expenses);
        }
    }

    async deleteBudget(budgetId: string) {
        const budgets = await this.getBudgets();
        if (budgets && budgetId in budgets) {
            delete budgets[budgetId];
            this.saveBudgets(budgets);
            localStorage.removeItem(this.getExpensesKey(budgetId));
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

    async saveCategories (categories: Categories) {
            localStorage.setItem(
                this.KEY_CATEGORIES, 
                JSON.stringify(categories));
    }

    async saveCategory (category: Category) {
        const categories = await this.getCategories();
        categories[category.id] = category;
        this.saveCategories(categories);
    }
}
