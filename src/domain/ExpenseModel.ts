import { Budget, Expense } from "../api";
import { NestedTotal } from "./NestedTotal";
import { DateDay } from "./DateDay";

export class ExpenseModel implements Expense {

    private _date?: DateDay;
    readonly amount: number;
    readonly amountBaseCurrency: number;
    readonly currency: string;
    readonly categoryId: string;
    readonly countryCode: string;
    readonly description?: string;
    readonly identifier: string;
    readonly when: number;
    readonly budgetId: string;
    readonly splitInDays: number;

    constructor (info: Expense) {
        this.identifier = info.identifier;
        this.amountBaseCurrency = info.amountBaseCurrency;
        this.amount = info.amount;
        this.currency = info.currency;
        this.categoryId = info.categoryId;
        this.countryCode = info.countryCode;
        this.description = info.description;
        this.when = info.when;
        this.budgetId = info.budgetId;
        this.splitInDays = info.splitInDays > 0 ? info.splitInDays : 1;
        this.validate();
    }

    get info (): Expense {
        const { amount, amountBaseCurrency, categoryId, countryCode, currency, description, identifier, when, budgetId, splitInDays} = this;
        return { amount, amountBaseCurrency, categoryId, description, identifier, when, countryCode, currency, budgetId, splitInDays};
    }

    get json (): string {
        return JSON.stringify(this.info);
    }

    get date () {
        if (!this._date) {
            this._date = DateDay.fromTimeMs(this.when);
        }
        return this._date;
    }

    get day () {
        return this.date.day;
    }

    get month () {
        return this.date.month;
    }

    get year () {
        return this.date.year;
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
        for (const em of this.split()) {
            totals.add(em.amountBaseCurrency, em.dateParts);
        }
    }

    subtractTotal(totals: NestedTotal) {
        for (const em of this.split()) {
            totals.subtract(em.amountBaseCurrency, em.dateParts);
        }
    }

    validate () {
        const fieldErrors = [];
        if (this.budgetId === undefined) {
            fieldErrors.push('budget identifier');
        }
        if (this.amountBaseCurrency === undefined) {
            fieldErrors.push('amount in base currency');
        }
        if (this.countryCode.length !== 2) {
            fieldErrors.push('country code');
        }
        if (this.currency.length !== 3) {
            fieldErrors.push('currency code');
        }
        if (fieldErrors.length > 0) {
            throw Error(`Invalid expense (${this.identifier}) fields: ${fieldErrors.join(', ')}`);
        }
    }

    /** 
     * @returns List of split expenses, first element will be current split expense
     */
    split(): ExpenseModel[] {
        if (this.splitInDays < 1) {
            throw Error('You cannot split an expense in less than one piece');
        } else if (this.splitInDays === 1) {
            return [this];
        } else {
            const amountBaseCurrency =  this.amountBaseCurrency / this.splitInDays;
            const amount = this.amount / this.splitInDays;
            const expenses = [new ExpenseModel({...this, amount, amountBaseCurrency})];
            for (let i=1; i<this.splitInDays; i++) {
                expenses.push(new ExpenseModel({
                    ...this,
                    amount, 
                    amountBaseCurrency,
                    when: DateDay.fromTimeMs(this.when).addDays(i).timeMs,
                }));
            }
            return expenses;
        }
    }
}
