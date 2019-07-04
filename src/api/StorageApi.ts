import { ExpensesMap, BudgetsMap, Budget, Expense } from "../interfaces";

export interface StorageApi {
    getBudgets(): Promise<BudgetsMap>;
    getExpenses(budgetId: string): Promise<ExpensesMap>;
    saveBudget(budget: Budget): Promise<void>;
    deleteBudget(budgetId: string): Promise<void>;
    saveExpense(budgetId: string, expense: Expense): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string): Promise<void>;
}
