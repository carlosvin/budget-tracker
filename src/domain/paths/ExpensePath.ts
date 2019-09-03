import { BudgetPath } from "./BudgetPath";

export class ExpensePath {
    readonly path: string;

    constructor(expenseId: string, budgetUrl: BudgetPath) {
        this.path = `${budgetUrl.path}/expenses/${expenseId}`;
    }
}
