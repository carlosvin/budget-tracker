import { BudgetUrl } from "./BudgetUrl";

export class ExpenseUrl {
    readonly path: string;

    constructor(budgetId: string, expenseId: string) {
        this.path = `${new BudgetUrl(budgetId).path}/expenses/${expenseId}`;
    }
}
