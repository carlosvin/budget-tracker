import { Budget, Expense } from "./interfaces";
import { currenciesStore } from "./stores/CurrenciesStore";
import { dateDiff } from "./utils";

export class BudgetModel {

    public readonly info: Budget;
    public readonly expenses: {[identifier: string]: Expense};

    private _totalExpenses?: number;
    private _days?: number;
    private _totalDays?: number;
    public readonly numberOfExpenses: number;

    constructor(info: Budget, expenses: {[identifier: string]: Expense}){
        this.info = info;
        this.expenses = expenses;
        this.numberOfExpenses = Object.keys(this.expenses).length;
    }

    get identifier () {
        return this.info.identifier;
    }

    async getTotalExpenses(): Promise<number> {
        if (!this._totalExpenses) {
            this._totalExpenses = await this.calculateTotalExpenses();
        }
        return this._totalExpenses;
    }

    private async calculateTotalExpenses () {
        const values = Object.values(this.expenses);
        if (values.length > 0) {
            let total = 0;
            for (const expense of values) {
                if (expense.amountBaseCurrency !== undefined) {
                    total = total + expense.amountBaseCurrency;
                } else {
                    const amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
                        this.info.currency, 
                        expense.currency, 
                        expense.amount);
                    total = total + amountBaseCurrency;
                }
            }
            return total;
        }
        return 0;
    }

    get days () {
        if (!this._days) {
            this._days = dateDiff(this.info.from, new Date().getTime()) + 1;
        }
        return this._days;
    }

    get totalDays () {
        if (!this._totalDays) {
            this._totalDays = dateDiff(this.info.from, this.info.to);
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
        return Math.round(this.info.total / this.totalDays);
    }
}