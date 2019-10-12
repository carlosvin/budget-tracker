
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

    pathExpensesByDay(year: number, month?: number, day?: number){
        const monthPart = month === undefined ? '' : `&month=${month}`;
        const dayPart = day === undefined ? '' : `&day=${day}`;
        return `${this.pathExpenses}?year=${year}${monthPart}${dayPart}`;
    }

    pathExpensesByCategory(categoryId: string){
        return `${this.pathExpenses}?category=${categoryId}`;
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
