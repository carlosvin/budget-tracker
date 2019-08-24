import { YMD } from "../interfaces";

export class BudgetUrl {

    readonly path: string;

    constructor(budgetId: string) {
        this.path = `${BudgetUrl.base}/${budgetId}`;
    }

    get pathEdit () {
        return `${this.path}/edit`;   
    }

    get pathStats () {
        return `${this.path}/stats`;   
    }

    get pathExport () {
        return `${this.path}/export`;   
    }

    get pathExpenses () {
        return `${this.path}/expenses`;   
    }

    get pathAddExpense () {
        return `${this.path}/expenses/add`;   
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

    pathExpensesByDay(date: YMD){
        const {year, month, day} = date;
        return `${this.pathExpenses}?year=${year}&month=${month}&day=${day}`
    }
}
