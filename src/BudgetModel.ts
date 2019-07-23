import { Budget, Expense, Categories, CurrencyRates, ExpensesMap, ExpensesYearMap } from "./interfaces";
import { dateDiff } from "./utils";
import { CurrenciesStore } from "./stores/CurrenciesStore";
import { NestedTotal } from "./NestedTotal";

export const DAY_MS = 24 * 3600 * 1000;

export class ExpenseModel {

    readonly date: Date;

    constructor (info: Expense) {
        this.date = new Date(info.when);
    }

    get day () {
        return this.date.getDate();
    }

    get month () {
        return this.date.getMonth();
    }

    get year () {
        return this.date.getFullYear();
    }

    get dateParts (): number[] {
        return [this.year, this.month, this.day];
    }

    static sum(expenses: Iterable<Expense>){
        return Object.values(expenses)
            .map(e => e.amountBaseCurrency)
            .reduce((a, b) => a + b);
    }
}

export class BudgetModel {

    private readonly _info: Budget;
    private readonly _expenses: ExpensesMap;
    private _expenseGroups?: ExpensesYearMap;

    private _nestedTotalExpenses?: NestedTotal;
    private _days?: number;
    private _totalDays?: number;

    constructor(info: Budget, expenses: ExpensesMap) {
        this._info = info;
        this._expenses = {};
        for (const k in expenses) {
            this._setExpense(expenses[k]);
        }
    }

    private _setExpense(expense: Expense){
        BudgetModel.validateExpense(expense);
        this._expenses[expense.identifier] = expense;
        this._addToGroup(expense);
    }

    static validateExpense (expense: Expense) {
        if (expense.amountBaseCurrency === undefined) {
            throw new Error(`Amount in base currency required for ${JSON.stringify(expense)}`);
        }
    }

    get numberOfExpenses () {
        return Object.keys(this._expenses).length;
    } 

    get identifier () {
        return this._info.identifier;
    }

    get info () {
        return this._info;
    }

    get expenses () {
        return this._expenses;
    }

    get totalExpenses() {
        return this.nestedTotalExpenses.total;
    }

    get nestedTotalExpenses () {
        if (this._nestedTotalExpenses===undefined) {
            this._nestedTotalExpenses = new NestedTotal();
            Object.values(this.expenses).forEach(e => this._addToTotal(e));
        }
        return this._nestedTotalExpenses;
    }

    getTotalExpensesByDay(year: number, month: number, day: number) {
        return this.nestedTotalExpenses.getSubtotal([year, month, day]);
    }

    getTotalExpensesByMonth(year: number, month: number) {
        return this.nestedTotalExpenses.getSubtotal([year, month]);
    }

    getTotalExpensesByYear(year: number) {
        return this.nestedTotalExpenses.getSubtotal([year,]);
    }

    getDays(year: number, month: number): number[]{
        return Object.keys(this.expenseGroups[year][month])
            .map(d => parseInt(d));
    }

    private _updateTotalExpenses(newExpense: Expense, oldExpense?: Expense) {
        if (oldExpense === undefined || 
            oldExpense.amountBaseCurrency !== newExpense.amountBaseCurrency || 
            oldExpense.when !== newExpense.when) {
            if (oldExpense) {
                this._subtractTotal(oldExpense);
            }
            this._addToTotal(newExpense);
        }
    }

    get years(): number[]{
        return Object.keys(this.expenseGroups)
            .map(d => parseInt(d));
    }

    setExpense(expense: Expense) {
        BudgetModel.validateExpense(expense);
        if (expense.identifier in this._expenses) {
            const oldExpense = this._expenses[expense.identifier];
            this._removeFromGroup(oldExpense);
            this._updateTotalExpenses(expense, oldExpense);
        } else {
            this._updateTotalExpenses(expense);
        }
        this._addToGroup(expense);
        this._expenses[expense.identifier] = expense;
    }

    getExpense (expenseId: string) {
        return this._expenses[expenseId];
    }

    get days () {
        if (!this._days) {
            this._days = dateDiff(this._info.from, new Date().getTime()) + 1;
        }
        return this._days;
    }

    get totalDays () {
        if (!this._totalDays) {
            this._totalDays = dateDiff(this._info.from, this._info.to);
        }
        return this._totalDays;
    }

    get average () {
        if (this.days > 0 && this.totalExpenses > 0) {
            return Math.round(this.totalExpenses / this.days);
        } else {
            return 0;
        }
    }

    get expectedDailyExpensesAverage () {
        return Math.round(this._info.total / this.totalDays);
    }

    get expectedMonthlyExpensesAverage () {
        return this.expectedDailyExpensesAverage * 30;
    }

    deleteExpense (expenseId: string) {
        if (expenseId in this._expenses) {
            const expense = this._expenses[expenseId];
            if (this._nestedTotalExpenses && expense.when <= new Date().getTime()) {
                this._subtractTotal(expense);
            }
            this._removeFromGroup(expense);
            delete this._expenses[expenseId];
            return true;
        }
        return false;
    }

    get expenseGroups () {
        if (!this._expenseGroups) {
            Object.values(this.expenses).forEach(e => this._addToGroup(e));
            if (!this._expenseGroups) {
                this._expenseGroups = {};
            }
        }
        return this._expenseGroups;
    }

    private _addToGroup (expense: Expense) {
        if (this._expenseGroups === undefined) {
            this._expenseGroups = {};
        }
        if (this._expenseGroups !== undefined) {
            const model = new ExpenseModel(expense);
            const {year, month, day} = model;
            if (!(year in this._expenseGroups)) {
                this._expenseGroups[year] = {};
            }
            if (!(month in this._expenseGroups[year])) {
                this._expenseGroups[year][month] = {};
            }
            if (!(day in this._expenseGroups[year][month])) {
                this._expenseGroups[year][month][day] = {};
            }
            this._expenseGroups[year][month][day][expense.identifier] = expense;
        }
    }

    private _removeFromGroup (expense: Expense) {
        if (this._expenseGroups !== undefined) {
            const {year, month, day} = new ExpenseModel(expense);
            try {
                delete this._expenseGroups[year][month][day][expense.identifier];
            } catch (error) {
                console.warn('Expense is not found in groups: ', expense);
            }
        }
    }

    private _updateExpensesBaseAmount(rates: CurrencyRates) {
        const newTotals = new NestedTotal();
        for (const k in this._expenses) {
            if (rates.base === this._expenses[k].currency) {
                this._expenses[k].amountBaseCurrency = this._expenses[k].amount; 
            } else {
                const currency = this._expenses[k].currency;
                const rate = rates.rates[currency];
                if (rate === undefined) {
                    throw new Error(`Cannot get currency exchange rate from ${rates.base} to ${currency}`);
                }
                this._expenses[k].amountBaseCurrency = CurrenciesStore.convert(
                    this._expenses[k].amount, rate);
            }
            BudgetModel._addToTotal(this.expenses[k], newTotals);
        }

        this._nestedTotalExpenses = newTotals;
    }

    private static _addToTotal(expense: Expense, totals: NestedTotal) {
        const em = new ExpenseModel(expense);
        totals.add(expense.amountBaseCurrency, em.dateParts);
    }

    private static _subtractTotal(expense: Expense, totals: NestedTotal) {
        const em = new ExpenseModel(expense);
        totals.subtract(expense.amountBaseCurrency, em.dateParts);
    }

    private _addToTotal(expense: Expense) {
        if (expense.when <= this.info.to && expense.when >= this.info.from) {
            BudgetModel._addToTotal(expense, this.nestedTotalExpenses);
        }
    }

    private _subtractTotal(expense: Expense) {
        if (expense.when <= this.info.to && expense.when >= this.info.from) {
            BudgetModel._subtractTotal(expense, this.nestedTotalExpenses); 
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

    getJson(categories: Categories) {
        return JSON.stringify(
            {
                info: this.info,
                expenses: this.expenses,
                categories
            }, null, 2
        );
    }
}
