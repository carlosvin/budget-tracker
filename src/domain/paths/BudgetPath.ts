import { YMD } from "../../interfaces";

export class BudgetPath {

    readonly path: string;

    constructor(budgetId: string) {
        this.path = `${BudgetPath.base}/${budgetId}`;
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

    get exportPath () {
        return `${this.path}/export`;
    }

    pathExpensesByDay(date: YMD){
        const {year, month, day} = date;
        return `${this.pathExpenses}?year=${year}&month=${month}&day=${day}`
    }

    static pathCombinedWithQuery(identifiers: Iterable<string>) {
        const usp = new URLSearchParams();
        for (const id of identifiers) {
            usp.append('identifiers[]', id);
        }
        return `${this.combined}?${usp.toString()}`;
    }

    static get combined() {
        return `${this.base}/combined`;
    }
}
