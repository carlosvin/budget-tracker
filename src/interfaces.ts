

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
    currency: string;
    category: string;
    description?: string;
    /** Timestamp when the expense applies */
    when: number;
    /** Timestamp when expense is registered in app */
    creation: number;
}

export interface CurrencyRates {
    readonly base: string;
    readonly rates: {[name: string]: number};
    readonly date: Date;
}
