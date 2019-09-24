import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";
import { DateDay } from "../DateDay";

export function getTotalsByCountry(budget: BudgetModel) {
    const totals = new NestedTotal();
    const toMs = Math.min(new DateDay().timeMs, budget.to);
    Object
        .values(budget.expenses)
        .filter(e => e.inDates(budget.from, toMs))
        .forEach((e) => totals.add(e.amountBaseCurrency, [e.countryCode,]));
    return totals;
}
