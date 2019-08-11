import { Categories, Category, Budget, Expense, ExpensesMap } from "../interfaces";
import { BudgetModel } from '../domain/BudgetModel';

export interface CategoriesStore {
    getCategories(): Promise<Categories>;
    setCategories(categories: Categories): Promise<void>;
    setCategory(category: Category): Promise<void>;
    getCategory(categoryId: string): Promise<Category>;
    delete(categoryId: string): Promise<boolean>;
}

export interface BudgetsStore {

    getBudgetModel(budgetId: string): Promise<BudgetModel>;
    setBudget(budget: Budget): Promise<void>;

    getExpensesByDay(budgetId: string, y: number, m: number, d: number): Promise<ExpensesMap>;

    setExpense(budgetId: string, expense: Expense): Promise<void>;
    getExpense(budgetId: string, expenseId: string): Promise<Expense>;
    deleteBudget(budgetId: string): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string): Promise<void>;
}
