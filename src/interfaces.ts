

export interface Budget {
    identifier: string;
    name: string;
    from: Date;
    to: Date;
    total: number;
    currency: string;
}

export interface BudgetExpenses {
    expenses: {[timestamp: number]: Expense};
}

export interface Expense {
    amount: number;
    currency: string;
    category: string;
    description: string;
    timestamp: number;
}

export interface CurrencyRates {
    readonly base: string;
    readonly rates: {[name: string]: number};
    readonly date: Date;
}
