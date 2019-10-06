import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";
import { DateDay } from "../DateDay";
import { ObjectMap } from "../../api";

export function getAverageDailyExpensesPerCountry(budget: BudgetModel) {
    const totals = new NestedTotal();
    const toMs = Math.min(new DateDay().timeMs, budget.to);
    const {expenses, from} = budget;
    for (const expense of expenses) {
        if (expense.inDates(from, toMs)){
            const {amountBaseCurrency, countryCode, date} = expense;
            totals.add(amountBaseCurrency, [countryCode, date.shortString])
        }
    }
    const dailyAvg: ObjectMap<number> = {};
    totals.indexes.forEach(country => (dailyAvg[country] = totals.getAverage([country])));
    return dailyAvg;
}
