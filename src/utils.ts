import { History } from "history";

export function slugify(str: string) {
    const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;';
    const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------';
    const p = new RegExp(a.split('').join('|'), 'g');
    return str.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '');
}

export function dateDiff(from: Date, to: Date) {
    return Math.round((to.getTime() - from.getTime())/(1000*60*60*24));
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
    private readonly budgetId: string;
    readonly path: string;
    readonly pathEdit: string;
    readonly pathAddExpense: string;

    constructor(budgetId: string) {
        this.budgetId = budgetId;
        this.path = `/budgets/${this.budgetId}`;
        this.pathEdit= `${this.path}/edit`;
        this.pathAddExpense = `${this.path}/expenses/add`;
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

export const TODAY_STRING = new Date().toISOString().slice(0,10);
