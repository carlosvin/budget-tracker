import { ExpensesMap, BudgetsMap } from "../interfaces";
//import { FirebaseApi } from "./Firebase";


export interface StorageApi {
    getBudgets(): Promise<BudgetsMap>;
    getExpenses(budgetId: string): Promise<ExpensesMap>;
    saveBudgets(budget: BudgetsMap): Promise<void>;
    saveExpenses(budgetId: string, expenses: ExpensesMap): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string): Promise<void>;

}

class LocalStorage implements StorageApi {
    
    private readonly KEY_BUDGETS = 'budgets';
    private readonly KEY_EXPENSES = 'expenses';

    get budgets () {
        const serializedBudgets = localStorage.getItem(this.KEY_BUDGETS);
        if (serializedBudgets) {
            return JSON.parse(serializedBudgets);
        }
        throw new Error('Error fetching budgets');
    }

    async getBudgets(): Promise<BudgetsMap> {
        return this.budgets;
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

    async saveBudgets(budgets: BudgetsMap) {
        localStorage.setItem(this.KEY_BUDGETS, JSON.stringify(budgets));
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
        const budgets = this.budgets;
        if (budgets && budgetId in budgets) {
            delete budgets[budgetId];
            this.saveBudgets(budgets);
            localStorage.removeItem(this.getExpensesKey(budgetId));
        }
    }
}

export const appStorage = new LocalStorage();
