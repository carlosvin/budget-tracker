import { ExpensesMap, BudgetsMap, Budget, Expense } from "../interfaces";
import { StorageApi } from "./StorageApi";

export class LocalStorage implements StorageApi {
    
    private readonly KEY_BUDGETS = 'budgets';
    private readonly KEY_EXPENSES = 'expenses';

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
        const budgets = await this.getBudgets();
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
}
