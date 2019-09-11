

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
    budgetId: string;
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
    identifier: string;
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

export interface CountryEntry {
    code: string;
    name: string;
}

export interface User {
    timestamp: number;
}

export interface ExportDataSet {
    budgets: BudgetsMap;
    categories: Categories;
    expenses: ExpensesMap;
    lastTimeSaved: number;
}

export enum SyncDirection {
    RemoteToLocal = 'RemoteToLocal', LocalToRemote = 'LocalToRemote'
}


export enum EntityNames {
    Budgets = 'budgets',
    Expenses = 'expenses',
    Categories = 'categories',
}
