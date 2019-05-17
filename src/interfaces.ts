

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
    amountBaseCurrency?: number;
    currency: string;
    categoryId: string;
    countryCode: string;
    description?: string;
    identifier: string;
    /** Timestamp when the expense applies */
    when: number;
}

export interface CurrencyRates {
    readonly base: string;
    readonly rates: {[name: string]: number};
    readonly date: Date;
}

export interface ImportedExpense {
    amount: string;
    amountInHomeCurrency: string;
    category: string;
    categoryId: string;
    conversionRate: number;
    country: string;
    countryCode: string;
    creditCard: boolean;
    datePaid: string;
    homeCurrency: string;
    localCurrency: string;
    notes: string;
    paidBy: string;
    tripId: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface Categories {
    [key: string]: Category;
}

export interface TitleNotifierProps {
    onTitleChange: (title: string) => void;
}