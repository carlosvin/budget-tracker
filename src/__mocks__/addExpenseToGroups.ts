import { ExpensesYearMap } from "../interfaces";
import { ExpenseModel } from "../domain/ExpenseModel";

export function addExpenseToGroups (groups: ExpensesYearMap, expense: ExpenseModel) {
    const {year, month, day} = expense;
    if (!(year in groups)) {
        groups[year] = {};
    }
    if (!(month in groups[year])) {
        groups[year][month] = {};
    }
    if (!(day in groups[year][month])) {
        groups[year][month][day] = {};
    }
    groups[year][month][day][expense.identifier] = expense;

}