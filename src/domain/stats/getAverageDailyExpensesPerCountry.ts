import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";
import { DateDay } from "../DateDay";
import { ObjectMap } from "../../interfaces";

export function getAverageDailyExpensesPerCountry(budget: BudgetModel) {
    const totals = new NestedTotal();
    const toMs = Math.min(new DateDay().timeMs, budget.to);
    Object
        .values(budget.expenses)
        .filter(e => e.inDates(budget.from, toMs))
        .forEach((e) => totals.add(e.amountBaseCurrency, [e.countryCode, e.date.shortString]));
    const dailyAvg: ObjectMap<number> = {};
    totals.indexes.forEach(country => (dailyAvg[country] = totals.getAverage([country])));
    return dailyAvg;
}
