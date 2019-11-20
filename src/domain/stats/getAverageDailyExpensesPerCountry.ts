import { BudgetModel } from "../BudgetModel";
import { NestedTotal } from "../NestedTotal";
import { DateDay } from "../DateDay";
import { ObjectMap } from "../../api";

export function getAverageDailyExpensesPerCountry(budget: BudgetModel) {
    const totals = new NestedTotal();
    const toMs = Math.min(new DateDay().timeMs, budget.to);
    const {from, expenseGroupsIn} = budget;
    
    for (const [year, months] of expenseGroupsIn) {
        for (const [month, days] of months) {
            for (const [day, expenses] of days) {
                let prevCountry;
                let total = 0;
                for (const em of expenses.values()) {
                    const {countryCode, amountBaseCurrency} = em;
                    if (!em.inDates(from, toMs) || (prevCountry && prevCountry !== countryCode)) {
                        total = 0;
                        break;
                    } else {
                        prevCountry = countryCode;
                        total = total + amountBaseCurrency;
                    }    
                }
                total && prevCountry && totals.add(
                    total, 
                    [prevCountry, DateDay.fromYMD({year,month,day}).shortString])
            }
        }
    }
    const dailyAvg: ObjectMap<number> = {};
    totals.indexes.forEach(country => (dailyAvg[country] = totals.getAverage([country])));
    return dailyAvg;
}
