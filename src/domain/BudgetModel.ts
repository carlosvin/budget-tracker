import { Budget, Expense, CategoriesMap, CurrencyRates, ExportDataSet } from "../api";
import { NestedTotal } from "./NestedTotal";
import { ExpenseModel } from "./ExpenseModel";
import { ExpensesYearMap } from "./ExpensesYearMap";
import { DateDay } from "./DateDay";

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

    getTotalExpenses(year: number, month?: number, day?: number): number;
    setExpense(expense: Expense): void;
    getExpense (expenseId: string): ExpenseModel;
    getExpensesByDay(year?: number, month?: number, day?: number): Map<DateDay, Map<string, ExpenseModel>> | undefined;
    deleteExpense (expenseId: string): boolean;
    setBudget(info: Budget, rates?: CurrencyRates): Promise<void>;
    export(categories: CategoriesMap): ExportDataSet;
}
