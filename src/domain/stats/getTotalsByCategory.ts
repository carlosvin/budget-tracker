import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";

export function getTotalsByCategory (budget: BudgetModel) {
    const totals = new NestedTotal();
    const {expenses} = budget;
    Object
        .values(expenses)
        .forEach((e) => totals.add(e.amountBaseCurrency, [e.categoryId,]));
    return totals;
}
