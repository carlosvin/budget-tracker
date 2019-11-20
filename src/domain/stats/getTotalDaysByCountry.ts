import { BudgetModel } from "../BudgetModel";
import { DateDay } from "../DateDay";
import { ObjectMap } from "../../api";

export function getTotalDaysByCountry (budgetModel: BudgetModel) {
    const daysByCountry: ObjectMap<number> = {};
    const {expenseGroupsIn, from} = budgetModel;
    const todayMs = Date.now();
    const fromDay = DateDay.fromTimeMs(from);
    const countriesInADay = new Set<string>();

    do {
        const expenses = expenseGroupsIn.getExpenses(fromDay);
        if (expenses) {
            countriesInADay.clear();
            expenses.forEach(e => countriesInADay.add(e.countryCode));
            countriesInADay.forEach(c => daysByCountry[c] = (daysByCountry[c] || 0) + 1);
        }
        fromDay.addDays(1);
    } while (fromDay.timeMs <= todayMs);
    return daysByCountry;
}
