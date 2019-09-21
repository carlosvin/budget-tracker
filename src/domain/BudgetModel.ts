import { Budget, Expense, Categories, CurrencyRates, ExpensesMap, ExpensesYearMap, ExportDataSet } from "../interfaces";
import { NestedTotal } from "./NestedTotal";
import { ExpenseModel } from "./ExpenseModel";

export interface BudgetModel extends Budget {

    readonly identifier: string;
    readonly numberOfExpenses: number;
    readonly expenses: ExpensesMap;
    readonly totalExpenses: number;
    readonly nestedTotalExpenses: NestedTotal;
    readonly totalsByCountry: NestedTotal;
    readonly totalsByCategory: NestedTotal;
    readonly years: number[];
    readonly daysUntilToday: number;
    readonly totalDays: number;
    readonly average: number;
    readonly expectedDailyExpensesAverage: number;
    readonly expenseGroups: ExpensesYearMap;
    readonly totalDaysByCountry: {[country: string]: number};
    readonly info: Budget;

    getTotalExpensesByDay(year: number, month: number, day: number): number;
    getTotalExpensesByMonth(year: number, month: number): number;
    getTotalExpensesByYear(year: number): number;
    getMonths(year: number): number[];
    getDays(year: number, month: number): number[];
    setExpense(expense: Expense): void;
    getExpense (expenseId: string): ExpenseModel;
    deleteExpense (expenseId: string): boolean;
    setBudget(info: Budget, rates?: CurrencyRates): Promise<void>;
    export(categories: Categories): ExportDataSet;

}
