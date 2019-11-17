import { ExpenseModel } from "./ExpenseModel";
import { YMD } from "../api";
import { DateDay } from "./DateDay";

export class ExpensesYearMap extends Map<number, ExpensesMonthMap> {

    addExpense(expense: ExpenseModel) {
        const { year } = expense;
        let months = this.get(year);
        if (months === undefined) {
            months = new ExpensesMonthMap();
            this.set(year, months);
        }
        months.addExpense(expense);
    }

    deleteExpense(expense: ExpenseModel) {
        const {year} = expense;
        const months = this.get(year);
        if (months && months.deleteExpense(expense)) {
            if (months.size === 0) {
                this.delete(year);
            }
            return true;
        }
        return false;
    }

    getExpenses({year, month, day}: YMD) {
        const months = this.get(year);
        if (months) {
            const days = months.get(month);
            if (days) {
                return days.get(day);
            }
        }
    }

    private static addDailyExpensesByDate (inputDays: ExpensesDayMap, output: ExpensesDayMap) {
        for (const d of inputDays.values()) {
            ExpensesYearMap.addExpensesByDate(d.values(), output);
        }
    }

    static addExpensesByDate (input: Iterable<ExpenseModel>, output: ExpensesDayMap = new ExpensesDayMap()) {
        for (const e of input) {
            let expensesMap = output.get(e.when);
            if (!expensesMap) {
                expensesMap = new Map();
                output.set(e.when, expensesMap);
            }
            expensesMap.set(e.identifier, e);
        }
        return output;
    }

    getAllGroupedByDate(year: number, month?: number, day?: number): ExpensesDayMap | undefined {
        const expenses: ExpensesDayMap = new ExpensesDayMap();
        if (month === undefined) {
            const months = this.get(year);
            if (months) {
                for (const m of months.values()) {
                    ExpensesYearMap.addDailyExpensesByDate(m, expenses);
                }    
            }
        } else if (day === undefined) {
            const months = this.get(year);
            if (months) {
                const days = months.get(month);
                if (days) {
                    ExpensesYearMap.addDailyExpensesByDate(days, expenses);
                }
            }
        } else {
            const dayExpenses = this.getExpenses({year, month, day});
            dayExpenses && ExpensesYearMap.addExpensesByDate(dayExpenses.values(), expenses);
        }
        return expenses;
    }

    getExpense(date: YMD, identifier: string){
        const expenses = this.getExpenses(date);
        if (expenses) {
            return expenses.get(identifier);
        }
    }

    getMonths(year: number): Iterable<number> {
        const months = this.get(year);
        return months ? months.keys() : [];
    }

    getDays(year: number, month: number): Iterable<number> {
        const months = this.get(year);
        if (months) {
            const days = months.get(month);
            return days ? days.keys() : [];
        }
        return [];
    }

    get years(): Iterable<number> {
        return this.keys();
    }

    get allGroupedByDate() {
        const byDate = new Map<string, Map<string, ExpenseModel>>();
        for (const year of this.years) {
            const byYear = this.getAllGroupedByDate(year);
            if (byYear) {
                byYear.forEach((v, k) => byDate.set(DateDay.fromTimeMs(k).shortString, v))
            }
        }
        return byDate;
    }

}

export class ExpensesMonthMap extends Map<number, ExpensesDayMap> { 
    addExpense(expense: ExpenseModel) {
        const { month } = expense;
        
        let days = this.get(month);
        if (days === undefined) {
            days = new ExpensesDayMap();
            this.set(month, days);
        }
        days.addExpense(expense);
    }

    deleteExpense(expense: ExpenseModel) {
        const {month} = expense;
        const days = this.get(month);
        if (days && days.deleteExpense(expense)) {
            if (days.size === 0) {
                this.delete(month);
            }
            return true;
        }
        return false;
    }
}

export class ExpensesDayMap extends Map<number, Map<string, ExpenseModel>> { 

    addExpense(expense: ExpenseModel) {
        const {day} = expense;
        let expenses = this.get(day);
        if (expenses === undefined) {
            expenses = new Map<string, ExpenseModel>();
            this.set(day, expenses);
        }
        expenses.set(expense.identifier, expense);
    }

    deleteExpense(expense: ExpenseModel) {
        const {day, identifier} = expense;
        const expenses = this.get(day);
        if (expenses && expenses.delete(identifier)) {
            if (expenses.size === 0) {
                this.delete(day);
            }
            return true;
        }
        return false;
    }
    
}