import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";

export function getTotalsByCategory (budget: BudgetModel) {
    const totals = new NestedTotal();
    for (const expense of budget.expenses) {
        totals.add(expense.amountBaseCurrency, [expense.categoryId,]);
    }
    return totals;
}
