import { ExpensesMap, BudgetsMap, Budget, Expense, Categories, Category } from "../../interfaces";

export interface StorageApi {
    getBudgets(): Promise<BudgetsMap>;
    getExpenses(budgetId: string): Promise<ExpensesMap>;
    saveBudget(budget: Budget): Promise<void>;
    deleteBudget(budgetId: string): Promise<void>;
    // saveExpense(budgetId: string, expense: Expense): Promise<void>;
    saveExpenses(budgetId: string, expense: Iterable<Expense>): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string): Promise<void>;

    getCategories(): Promise<Categories>;
    saveCategory(category: Category): Promise<void>;
    saveCategories(categories: Categories): Promise<void>;

    getLastTimeSaved(): Promise<number>;
    setLastTimeSaved(timestamp: number): Promise<void>;

}
