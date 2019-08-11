import { Budget, Expense } from "../interfaces";
import { NestedTotal } from "./NestedTotal";

export class ExpenseModel implements Expense {

    readonly date: Date;
    readonly amount: number;
    private _amountBaseCurrency: number;
    readonly currency: string;
    readonly categoryId: string;
    readonly countryCode: string;
    readonly description?: string;
    readonly identifier: string;
    readonly when: number;

    constructor (info: Expense) {
        this.date = new Date(info.when);
        this.identifier = info.identifier;
        this._amountBaseCurrency = info.amountBaseCurrency;
        this.amount = info.amount;
        this.currency = info.currency;
        this.categoryId = info.categoryId;
        this.countryCode = info.countryCode;
        this.description = info.description;
        this.when = info.when;
        this.validate();
    }

    get info (): Expense {
        const {amount, amountBaseCurrency, categoryId, countryCode, currency, description, identifier, when} = this;
        return { amount, amountBaseCurrency, categoryId, description, identifier, when, countryCode, currency };
    }

    get amountBaseCurrency () {
        return this._amountBaseCurrency;
    }

    set amountBaseCurrency (amount: number) {
        this._amountBaseCurrency = amount;
        this.validate();
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

    inBudgetDates (budget: Budget) {
        return this.when <= budget.to && this.when >= budget.from;
    }

    inDates (fromMs: number, toMs: number) {
        return this.when <= toMs && this.when >= fromMs;
    }

    addToTotals(totals: NestedTotal) {
        totals.add(this.amountBaseCurrency, this.dateParts);
    }

    subtractTotal(totals: NestedTotal) {
        totals.subtract(this.amountBaseCurrency, this.dateParts);
    }

    validate () {
        if (this.amountBaseCurrency === undefined) {
            throw new Error(`Amount in base currency required, expense id: ${this.identifier}`);
        }
    }
}
