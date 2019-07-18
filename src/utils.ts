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

    expensePath(expenseId?: string) {
        return `${this.path}#${expenseId}`;
    }
}

export class ExpenseUrl {
    readonly path: string;

    constructor(budgetId: string, expenseId: number) {
        this.path = `${new BudgetUrl(budgetId).path}/expenses/${expenseId}`;
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

export function hash(str: string) {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash<<5)-hash) /* same as hash *31 */ + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export function stringToColor (text: string) {
    let hashed = Math.abs(hash(text));
    const r = hashed % 200;
    hashed = hashed >> 7;
    const g = hashed % 200;
    hashed = hashed >> 7;
    const b = hashed % 200;
    return {r, g, b};
}

export function stringToColorCss (text: string) {
    const rgb = stringToColor(text);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}