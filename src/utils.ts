import { History } from "history";

/**
 * Get difference between 2 dates in days
 * @param from - Starting period timestamp
 * @param to - Ending period timestamp
 */
export function dateDiff(from: number, to: number) {
    return Math.round((to - from)/(1000*60*60*24));
}

export const goBack = (history: History) => {
    if (history.length > 2) {
        history.goBack();
    } else {
        history.replace('/');
    }
}

export function timestampToDate(timestamp: number) {
    return new Date(timestamp).toDateString();
}

export class BudgetUrl {

    readonly path: string;
    readonly pathEdit: string;
    readonly pathAddExpense: string;

    private readonly budgetId: string;

    constructor(budgetId: string) {
        this.budgetId = budgetId;
        this.path = `${BudgetUrl.base}/${this.budgetId}`;
        this.pathEdit= `${this.path}/edit`;
        this.pathAddExpense = `${this.path}/expenses/add`;
    }

    static get base () {
        return '/budgets';
    }

    static get add () {
        return `${this.base}/add`;
    }

    static get import () {
        return `${this.base}/import`;
    }
}

export class ExpenseUrl {
    private readonly budgetUrl: BudgetUrl;
    private readonly timestamp: number;
    readonly path: string;

    constructor(budgetId: string, timestamp: number) {
        this.budgetUrl = new BudgetUrl(budgetId);
        this.timestamp = timestamp;
        this.path = `${this.budgetUrl.path}/expenses/${this.timestamp}`;
    }
}

/** 
 * @returns Date (no time) as string type in ISO format
 */
export function getDateString (date = new Date()) {
    return date.toISOString().slice(0,10);
}

export function round(quantity: number, digits = 2){
    const coefficient = Math.pow(10, digits);
    return Math.round(quantity * coefficient) / coefficient
}

export function uuid() {
    // TODO generate uuid following spec
    return new Date().getTime().toString();
}

export const range = (start: number, end: number, length = end - start) =>
    Array.from({ length }, (_, i) => start + i)
