import { BudgetModel } from "../BudgetModel";
import { DateDay } from "../DateDay";

export function getTotalDaysByCountry (budgetModel: BudgetModel) {
    const daysByCountry: {[country: string]: number} = {};
    const {expenseGroups, from} = budgetModel;
    const todayMs = Date.now();
    const fromDay = DateDay.fromTimeMs(from);
    do {
        const expenses = expenseGroups.getExpenses(fromDay);
        if (expenses) {
            const countriesInADay = new Set<string>();
            for (const expense of expenses.values()) {
                countriesInADay.add(expense.countryCode);
            }
            countriesInADay.forEach(c=> {
                if (c in daysByCountry) {
                    daysByCountry[c] += 1;
                } else {
                    daysByCountry[c] = 1;
                }
            });
        }
        fromDay.addDays(1);
    } while (fromDay.timeMs <= todayMs);
    return daysByCountry;
}
