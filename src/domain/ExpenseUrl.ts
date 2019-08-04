import { BudgetUrl } from "./BudgetUrl";

export class ExpenseUrl {
    readonly path: string;

    constructor(budgetId: string, expenseId: number) {
        this.path = `${new BudgetUrl(budgetId).path}/expenses/${expenseId}`;
    }
}
