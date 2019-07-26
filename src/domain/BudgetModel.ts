import { Budget, Expense, Categories, CurrencyRates, ExpensesMap, ExpensesYearMap } from "../interfaces";
import { dateDiff } from "../utils";
import { CurrenciesStore } from "../stores/CurrenciesStore";
import { NestedTotal } from "../NestedTotal";
import { ExpenseModel } from "./ExpenseModel";

export const DAY_MS = 24 * 3600 * 1000;

export class BudgetModel {

    private readonly _info: Budget;
    private readonly _expenses: {[id: string]: ExpenseModel};
    private _expenseGroups?: ExpensesYearMap;

    private _nestedTotalExpenses?: NestedTotal;
    private _totalsByCategories?: NestedTotal;
    private _totalsByCountry?: NestedTotal;
    
    private _days?: number;
    private _totalDays?: number;

    constructor(info: Budget, expenses: ExpensesMap) {
        this._info = info;
        this._expenses = {};
        for (const k in expenses) {
            this._setExpense(new ExpenseModel(expenses[k]));
        }
    }

    private _setExpense(expense: ExpenseModel){
        this._expenses[expense.identifier] = expense;
        this._addToGroup(expense);
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
        if (this._nestedTotalExpenses === undefined) {
            this._nestedTotalExpenses = new NestedTotal();
            Object.values(this.expenses).forEach(e => this._addToTotal(e, false));
        }
        return this._nestedTotalExpenses;
    }

    get totalsByCountry () {
        if (this._totalsByCountry === undefined) {
            this._totalsByCountry = new NestedTotal();
            Object.values(this.expenses).forEach((e) => this._addTotalsByCountry(e));
        }
        return this._totalsByCountry;
    }

    private _addTotalsByCountry (expense: Expense) {
        if (this._totalsByCountry) {
            this._totalsByCountry.add(
                expense.amountBaseCurrency, [expense.countryCode,]);
        }
    }
    
    private _subtractTotalsByCountry (expense: Expense) {
        if (this._totalsByCountry) {
            this._totalsByCountry.subtract(
                expense.amountBaseCurrency, [expense.countryCode,]);
        }
    }

    get totalsByCategory () {
        if (this._totalsByCategories === undefined) {
            this._totalsByCategories = new NestedTotal();
            Object.values(this.expenses).forEach((e) => this._addTotalsByCategory(e));
        }
        return this._totalsByCategories;
    }

    private _addTotalsByCategory (expense: Expense) {
        if (this._totalsByCategories) {
            this._totalsByCategories.add(
                expense.amountBaseCurrency, [expense.categoryId,]);
        }
    }
    
    private _subtractTotalsByCategory (expense: Expense) {
        if (this._totalsByCategories) {
            this._totalsByCategories.subtract(
                expense.amountBaseCurrency, [expense.categoryId,]);
        }
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

    get years(): number[]{
        return Object.keys(this.expenseGroups)
            .map(d => parseInt(d));
    }

    setExpense(expense: Expense) {
        const newExpense = new ExpenseModel(expense);
        if (expense.identifier in this._expenses) {
            const oldExpense = this._expenses[expense.identifier];
            this._removeFromGroup(oldExpense);
            this._updateTotalExpenses(newExpense, oldExpense);
        } else {
            this._updateTotalExpenses(newExpense);
        }
        this._addToGroup(newExpense);
        this._expenses[expense.identifier] = newExpense;
    }

    getExpense (expenseId: string): ExpenseModel {
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
            this._subtractTotal(expense);
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

    private _addToGroup (expense: ExpenseModel) {
        if (this._expenseGroups === undefined) {
            this._expenseGroups = {};
        }
        if (this._expenseGroups !== undefined) {
            const {year, month, day} = expense;
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

    private _removeFromGroup (expense: ExpenseModel) {
        if (this._expenseGroups !== undefined) {
            const {year, month, day, identifier} = expense;
            try {
                delete this._expenseGroups[year][month][day][identifier];
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
            this._expenses[k].addToTotals(newTotals);
        }
        this._nestedTotalExpenses = newTotals;
    }

    private _addToTotal(expense: ExpenseModel, updateExtraTotals = true) {
        if (expense.inBudgetDates(this._info)) {
            expense.addToTotals(this.nestedTotalExpenses);
            if (updateExtraTotals) {
                this._addTotalsByCategory(expense);
                this._addTotalsByCountry(expense);    
            }
        }
    }

    private _subtractTotal(expense: ExpenseModel) {
        if (expense.inBudgetDates(this._info)) {
            expense.subtractTotal(this.nestedTotalExpenses);
            this._subtractTotalsByCategory(expense);
            this._subtractTotalsByCountry(expense);
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
                expenses: this.expenses as ExpensesMap,
                categories
            }, null, 2
        );
    }
}