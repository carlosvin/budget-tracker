import { Budget, Expense, CategoriesMap, CurrencyRates, ExportDataSet, ObjectMap } from "../api";
import { NestedTotal } from "./NestedTotal";
import { ExpenseModel } from "./ExpenseModel";
import { ExpensesYearMap } from "./ExpensesYearMap";

export interface BudgetModel extends Budget {

    readonly identifier: string;
    readonly numberOfExpenses: number;
    readonly expenses: Iterable<ExpenseModel>;
    readonly totalExpenses: number;
    readonly nestedTotalExpenses: NestedTotal;
    readonly daysUntilToday: number;
    readonly totalDays: number;
    readonly average: number;
    readonly expectedDailyExpensesAverage: number;
    readonly expenseGroups: ExpensesYearMap;
    readonly info: Budget;

    getTotalExpensesByDay(year: number, month: number, day: number): number;
    getTotalExpensesByMonth(year: number, month: number): number;
    getTotalExpensesByYear(year: number): number;
    setExpense(expense: Expense): void;
    getExpense (expenseId: string): ExpenseModel;
    deleteExpense (expenseId: string): boolean;
    setBudget(info: Budget, rates?: CurrencyRates): Promise<void>;
    export(categories: CategoriesMap): ExportDataSet;
}
