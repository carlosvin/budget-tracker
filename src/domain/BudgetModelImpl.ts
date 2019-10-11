import { Budget, Expense, CategoriesMap, CurrencyRates, ExpensesMap, ExportDataSet } from "../api";
import { dateDiff } from "./date";
import { NestedTotal } from "./NestedTotal";
import { ExpenseModel } from "./ExpenseModel";
import applyRate from "./utils/applyRate";
import { BudgetModel } from "./BudgetModel";
import { ExpensesYearMap } from "./ExpensesYearMap";
import { DateDay } from "./DateDay";

export class BudgetModelImpl implements BudgetModel {

    private readonly _info: Budget;
    private readonly _expenses: Map<string, ExpenseModel>;
    private _expenseGroups?: ExpensesYearMap;

    private _nestedTotalExpenses?: NestedTotal;

    private _days?: number;
    private _totalDays?: number;

    constructor(info: Budget, expenses: Iterable<Expense> = []) {
        this._info = info;
        this._expenses = new Map();
        for (const expense of expenses) {
            this._expenses.set(
                expense.identifier, 
                new ExpenseModel(expense));
        }
    }

    get numberOfExpenses() {
        return this._expenses.size;
    }

    get identifier() {
        return this._info.identifier;
    }

    get currency() {
        return this._info.currency;
    }

    get from() {
        return this._info.from;
    }

    get name() {
        return this._info.name;
    }

    get to() {
        return this._info.to;
    }

    get total() {
        return this._info.total;
    }

    get info() {
        return this._info;
    }

    get expenses() {
        return this._expenses.values();
    }

    get totalExpenses() {
        return this.nestedTotalExpenses.total;
    }

    get nestedTotalExpenses() {
        if (this._nestedTotalExpenses === undefined) {
            this._nestedTotalExpenses = new NestedTotal();
            this._expenses.forEach(e => this._addToTotal(e));
        }
        return this._nestedTotalExpenses;
    }

    getTotalExpenses(year: number, month?: number, day?: number) {
        const keys = [year];
        month !== undefined && keys.push(month);
        day !== undefined && keys.push(day);
        return this.nestedTotalExpenses.getSubtotal(keys);
    }

    getExpensesByDay (year?: number, month?: number, day?: number): Map<DateDay, Map<string, ExpenseModel>> | undefined {
        if (year === undefined) {
            return ExpensesYearMap.addExpensesByDate(this._expenses.values());
        } else {
            return this.expenseGroups.getAllGroupedByDate(year, month, day);
        }
    }

    private _updateTotalExpenses(newExpense: ExpenseModel, oldExpense?: ExpenseModel) {
        if (oldExpense === undefined ||
            oldExpense.amountBaseCurrency !== newExpense.amountBaseCurrency ||
            oldExpense.when !== newExpense.when ||
            oldExpense.categoryId !== newExpense.categoryId ||
            oldExpense.countryCode !== newExpense.countryCode) {
            if (oldExpense) {
                this._subtractTotal(oldExpense);
            }
            this._addToTotal(newExpense);
        }
    }

    setExpense(expense: Expense) {
        const newExpense = new ExpenseModel(expense);
        const oldExpense = this._expenses.get(expense.identifier);
        if (oldExpense) {
            const oldExpenses = oldExpense.split();
            for (const oe of oldExpenses) {
                this.expenseGroups.deleteExpense(oe);
            }
            this._updateTotalExpenses(newExpense, oldExpense);
        } else {
            this._updateTotalExpenses(newExpense);
        }
        for (const ne of newExpense.split()) {
            this.expenseGroups.addExpense(ne);
        }
        this._expenses.set(expense.identifier, newExpense);
    }

    getExpense(expenseId: string): ExpenseModel {
        const expense = this._expenses.get(expenseId);
        if (expense) {
            return expense;
        }
        throw new Error(`Expense with ID "${expenseId}" not found`);
    }

    get daysUntilToday() {
        if (!this._days) {
            this._days = dateDiff(this._info.from, Date.now());
        }
        return this._days;
    }

    get totalDays() {
        if (!this._totalDays) {
            this._totalDays = dateDiff(this._info.from, this._info.to);
        }
        return this._totalDays;
    }

    get average() {
        if (this.daysUntilToday > 0 && this.totalExpenses > 0) {
            return Math.round(this.totalExpenses / this.daysUntilToday);
        } else {
            return 0;
        }
    }

    get expectedDailyExpensesAverage() {
        return Math.round(this._info.total / this.totalDays);
    }

    deleteExpense(expenseId: string) {
        const expense = this._expenses.get(expenseId);
        if (expense && this._expenses.delete(expenseId)) {
            this._subtractTotal(expense);
            this.expenseGroups.deleteExpense(expense);
            return true;
        }
        return false;
    }

    get expenseGroups() {
        if (!this._expenseGroups) {
            const eg = new ExpensesYearMap();
            this._expenses
                .forEach(expense => expense.split()
                .forEach(splitExpense => eg.addExpense(splitExpense)));
            this._expenseGroups = eg;
        }
        return this._expenseGroups;
    }

    private static _getBaseAmount(expense: Expense, rates: CurrencyRates) {
        const {currency, amount} = expense;
        if (rates.base === currency) {
            return amount;
        } else {
            const rate = rates.rates[currency];
            if (rate === undefined) {
                throw new Error(`Cannot get currency exchange rate from ${rates.base} to ${currency}`);
            }
            return applyRate(amount, rate);
        }
    }

    private _updateExpensesBaseAmount(rates: CurrencyRates) {
        const newTotals = new NestedTotal();
        for (const expense of this._expenses.values()) {
            expense.amountBaseCurrency = BudgetModelImpl._getBaseAmount(expense, rates);
            expense.addToTotals(newTotals);
        }
        this._nestedTotalExpenses = newTotals;
    }

    private _addToTotal(expense: ExpenseModel) {
        if (expense.inBudgetDates(this._info)) {
            expense.addToTotals(this.nestedTotalExpenses);
        }
    }

    private _subtractTotal(expense: ExpenseModel) {
        if (expense.inBudgetDates(this._info)) {
            expense.subtractTotal(this.nestedTotalExpenses);
        }
    }

    async setBudget(info: Budget, rates?: CurrencyRates) {
        if (info.identifier !== this.identifier) {
            throw new Error('Cannot update budget information with different IDs');
        }

        if (info.currency !== this._info.currency) {
            if (!rates) {
                throw new Error('Required conversion rates to update budget currency');
            }
            this._updateExpensesBaseAmount(rates);
            this._info.currency = info.currency;
        }

        this._info.name = info.name;
        this._info.total = info.total;

        if (this._info.from !== info.from) {
            this._days = this._totalDays = undefined;
            this._info.from = info.from;
        }

        if (this._info.to !== info.to) {
            this._days = this._totalDays = undefined;
            this._info.to = info.to;
        }

        return Promise.resolve();
    }

    export(categories: CategoriesMap): ExportDataSet {
        const expenses: ExpensesMap = {};
        this._expenses.forEach((e, id) => (expenses[id] = e.info));
        return {
            budgets: { [this.identifier]: this.info },
            expenses,
            categories,
            lastTimeSaved: Date.now()
        };
    }
}
