import { ExpenseModel } from "./ExpenseModel";
import { ExpensesYearMap } from "./ExpensesYearMap";
import { createExpense } from "../__mocks__/createExpense";
import { createBudget } from "../__mocks__/createBudget";

describe('Expenses dates map', () => {

    it('Basic operations (excluding Map ones)', () => {
        const budget = createBudget();
        const expenses = new ExpensesYearMap();
        const em1 = new ExpenseModel(createExpense('1', budget));
        expenses.addExpense(em1);
        const {year, month, day} = em1;
        expect(Array.from(expenses.years)).toStrictEqual([year]);
        expect(Array.from(expenses.getMonths(year))).toStrictEqual([month]);
        expect(Array.from(expenses.getDays(year, month))).toStrictEqual([day]);
        expect(expenses.getExpenses(em1)).toStrictEqual(new Map([[em1.identifier, em1]]));
        expect(expenses.getExpense(em1, em1.identifier)).toStrictEqual(em1);

        const em2 = new ExpenseModel(createExpense('2', budget));
        expect(expenses.deleteExpense(em2)).toBe(false);
        expect(expenses.deleteExpense(em1)).toBe(true);
        expect(Array.from(expenses.years)).toStrictEqual([]);
        expect(Array.from(expenses.getMonths(year))).toStrictEqual([]);
        expect(Array.from(expenses.getDays(year, month))).toStrictEqual([]);
        expect(expenses.getExpenses(em1)).toBe(undefined);
        expect(expenses.getExpense(em1, em1.identifier)).toBe(undefined);
    });

});
