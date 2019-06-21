import { Budget, Expense } from "./interfaces";
import { currenciesStore } from "./stores/CurrenciesStore";
import { dateDiff } from "./utils";

export class BudgetModel {

    private readonly _info: Budget;
    private readonly _expenses: {[identifier: string]: Expense};

    private _totalExpenses?: number;
    private _days?: number;
    private _totalDays?: number;
    public readonly numberOfExpenses: number;
    private _expenseGroups?: {[group: number]: Expense[]};

    constructor(info: Budget, expenses: {[identifier: string]: Expense}) {
        this._info = info;
        this._expenses = expenses || {};
        this.numberOfExpenses = Object.keys(this._expenses).length;
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

    async getTotalExpenses(): Promise<number> {
        if (!this._totalExpenses) {
            this._totalExpenses = await this.calculateTotalExpenses();
        }
        return this._totalExpenses;
    }

    setExpense(expense: Expense) {
        this._expenses[expense.identifier] = expense;
        this.addToGroup(expense);
    }

    private async calculateTotalExpenses () {
        const values = Object.values(this._expenses);
        if (values.length > 0) {
            let total = 0;
            for (const expense of values) {
                if (expense.amountBaseCurrency !== undefined) {
                    total = total + expense.amountBaseCurrency;
                } else {
                    const amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
                        this._info.currency, 
                        expense.currency, 
                        expense.amount);
                    total = total + amountBaseCurrency;
                }
            }
            return total;
        }
        return 0;
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

    async getAverage () {
        const totalExpenses = await this.getTotalExpenses();
        if (this.days > 0 && totalExpenses > 0) {
            return Math.round(totalExpenses / this.days);
        } else {
            return 0;
        }
    }

    get expectedDailyExpensesAverage () {
        return Math.round(this._info.total / this.totalDays);
    }

    deleteExpense (expenseId: string) {
        if (expenseId in this._expenses) {
            delete this._expenses[expenseId];
            return true;
        }
        return false;
    }

    private addToGroup (expense: Expense) {
        if (!this._expenseGroups) {
            this._expenseGroups = {};
        }
        if (!(expense.when in this._expenseGroups)) {
            this._expenseGroups[expense.when] = [];
        }
        this._expenseGroups[expense.when].push(expense);
    }

    get expensesGroupedByDate () {
        if (!this._expenseGroups) {
            Object.values(this._expenses).forEach(e => this.addToGroup(e));
            this.sortExpenseByGroup();
        }
        return this._expenseGroups;
    }

    private sortExpenseByGroup () {
        if (this._expenseGroups) {
            // TODO maybe we can use a sorted structure, so we don't have to sort it later
            const sorted: {[group: number]: Expense[]} = {};
            Object.keys(this._expenseGroups)
                .map(k => parseInt(k))
                .sort((a, b)=> (b-a))
                .forEach(k=> (sorted[k] = (this._expenseGroups && this._expenseGroups[k]) || []));
            this._expenseGroups = sorted;
        }
    }

    private async updateBaseAmount() {
        for (const k in this._expenses) {
            this._expenses[k].amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
                this._info.currency, 
                this._expenses[k].currency, 
                this._expenses[k].amount);
        }
    }

    async setBudget(info: Budget) {
        this._info.currency = info.currency;
        this._info.from = info.from;
        this._info.name = info.name;
        this._info.to = info.to;
        this._info.total = info.total;
        return this.updateBaseAmount();
    }
}