

export interface Budget {
    identifier: string;
    name: string;
    total: number;
    currency: string;
    /** Timestamp for starting date */
    from: number;
    /** Timestamp for ending date */
    to: number;
}

export interface BudgetExpenses {
    expenses: {[timestamp: number]: Expense};
}

export interface Expense {
    amount: number;
    amountBaseCurrency: number;
    currency: string;
    categoryId: string;
    countryCode: string;
    description?: string;
    identifier: string;
    /** Timestamp when the expense applies */
    when: number;
}

export interface ExpensesMap {
    [identifier: string]: Expense;
}

export interface BudgetsMap {
    [identifier: string]: Budget;
}

export interface CurrencyRates {
    readonly base: string;
    readonly rates: {[name: string]: number};
    readonly date: Date;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface Categories {
    [key: string]: Category;
}

export interface ExpensesYearMap {
    [year: number]: ExpensesMonthMap
}

export interface ExpensesMonthMap {
    [month: number]: ExpensesDayMap
}

export interface ExpensesDayMap {
    [day: number]: ExpensesMap
}

export interface YMD {
    year: number,
    month: number,
    day: number
}