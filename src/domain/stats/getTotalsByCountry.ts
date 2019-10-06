import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";
import { DateDay } from "../DateDay";

export function getTotalsByCountry(budget: BudgetModel) {
    const totals = new NestedTotal();
    const toMs = Math.min(new DateDay().timeMs, budget.to);
    for (const expense  of budget.expenses) {
        if (expense.inDates(budget.from, toMs)) {
            totals.add(expense.amountBaseCurrency, [expense.countryCode,]);
        }
    }
    return totals;
}
