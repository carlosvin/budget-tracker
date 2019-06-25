import { Budget, Expense } from "./interfaces";
import { currenciesStore } from "./stores/CurrenciesStore";
import { dateDiff } from "./utils";
import { categoriesStore } from "./stores/CategoriesStore";

export const DAY_MS = 24 * 3600 * 1000;

export class BudgetModel {

    private readonly _info: Budget;
    private readonly _expenses: {[identifier: string]: Expense};
    private _expenseGroups?: {[group: string]: { [identifier: string]: Expense }} ;

    private _totalExpenses?: number;
    private _days?: number;
    private _totalDays?: number;

    constructor(info: Budget, expenses: {[identifier: string]: Expense}) {
        this._info = info;
        this._expenses = {};
        for (const k in expenses) {
            this._setExpense(expenses[k]);
        }
    }

    private _setExpense(expense: Expense){
        BudgetModel.validateExpense(expense);
        this._expenses[expense.identifier] = expense;
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

    static getGroup (expense: Expense) {
        const dateTime = new Date(expense.when);
        const date = new Date(
            dateTime.getFullYear(), 
            dateTime.getMonth(), 
            dateTime.getDate());
        return date.getTime();
    }

    async getTotalExpenses(): Promise<number> {
        if (this._totalExpenses === undefined) {
            this._totalExpenses = await this.calculateTotalExpenses();
        }
        return this._totalExpenses;
    }

    private async calculateTotalExpenses () {
        const now = new Date().getTime();
        const values = Object.values(this._expenses).filter(e=> e.when <= now);
        if (values.length > 0) {
            let total = 0;
            for (const expense of values) {
                total = total + expense.amountBaseCurrency;
            }
            return total;
        }
        return 0;
    }

    private _updateTotalExpenses(newExpense: Expense, oldExpense?: Expense) {
        if (oldExpense === undefined || 
            oldExpense.amountBaseCurrency !== newExpense.amountBaseCurrency || 
            oldExpense.when !== newExpense.when) {
            const now = new Date().getTime();
            if (oldExpense && oldExpense.when <= now) {
                this._sumToTotalExpenses(-oldExpense.amountBaseCurrency);
            }
            if (newExpense.when <= now) {
                this._sumToTotalExpenses(newExpense.amountBaseCurrency);
            }
        }
    }

    private _sumToTotalExpenses (amount: number) {
        if (this._totalExpenses !== undefined) {
            this._totalExpenses += amount;
        }
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
        this._addToGroup(expense, true);
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
            const expense = this._expenses[expenseId];
            if (this._totalExpenses && expense.when <= new Date().getTime()) {
                this._totalExpenses -= expense.amountBaseCurrency;
            }
            this._removeFromGroup(expense);
            delete this._expenses[expenseId];
            return true;
        }
        return false;
    }

    private _addToGroup (expense: Expense, sort = false) {
        if (this._expenseGroups !== undefined) {
            const group = BudgetModel.getGroup(expense);
            if (!(group in this._expenseGroups)) {
                this._expenseGroups[group] = {};
                if (sort) {
                    this._sortExpenseByGroup();
                }
            }
            this._expenseGroups[group][expense.identifier] = expense;
        }
    }

    private _removeFromGroup (expense: Expense) {
        if (this._expenseGroups !== undefined) {
            const group = BudgetModel.getGroup(expense);
            if (this._expenseGroups && group in this._expenseGroups) {
                delete this._expenseGroups[group][expense.identifier];
                if (Object.keys(this._expenseGroups[group]).length === 0) {
                    delete this._expenseGroups[group];
                }
            }    
        }
    }

    get expensesGroupedByDate () {
        if (this._expenseGroups === undefined) {
            this._expenseGroups = {};
            Object.values(this._expenses).forEach(e => this._addToGroup(e));
            this._sortExpenseByGroup();
        }
        return this._expenseGroups;
    }

    private _sortExpenseByGroup () {
        if (this._expenseGroups) {
            // TODO maybe we can use a sorted structure, so we don't have to sort it later
            const sorted: {[group: number]: { [expenseId: string]: Expense }} = {};
            Object.keys(this._expenseGroups)
                .map(k => parseInt(k))
                .sort((a, b)=> (b - a))
                .forEach(k => (sorted[k] = (this._expenseGroups && this._expenseGroups[k]) || {}));
            this._expenseGroups = sorted;
        }
    }

    private async _updateExpensesBaseAmount() {
        for (const k in this._expenses) {
            this._expenses[k].amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
                this._info.currency, 
                this._expenses[k].currency, 
                this._expenses[k].amount);
        }
        this._totalExpenses = undefined;
    }

    async setBudget(info: Budget) {
        if (info.identifier !== this.identifier) {
            throw new Error('Cannot update budget information with different IDs');
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

        if (info.currency !== this._info.currency) {
            this._info.currency = info.currency;
            return this._updateExpensesBaseAmount();
        }
        
        return Promise.resolve();
    }

    get json() {
        return JSON.stringify(
            {
                info: this.info,
                expenses: this.expenses,
                categories: categoriesStore.getCategories()
            }, null, 2
        );
    }
}