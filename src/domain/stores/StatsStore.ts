import { Budget, Expense } from "../../interfaces";
import { dateDiff } from "../date";
import { btApp } from "../../BudgetTracker";

export class StatsStore {

    static async getTotalExpenses(budget: Budget, expenses: {[identifier: string]: Expense}) {
        if (expenses && budget) {
            const currenciesStore = await btApp.getCurrenciesStore();
            const values = Object.values(expenses);
            if (values.length > 0) {
                let total = 0;
                for (const expense of values) {
                    if (expense.amountBaseCurrency !== undefined) {
                        total = total + expense.amountBaseCurrency;
                    } else {
                        const amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
                            budget.currency, 
                            expense.currency, 
                            expense.amount);
                        total = total + amountBaseCurrency;
                    }
                }
                return total;
            }
        }
        return 0;
    }

    static getDays (budget: Budget) {
        return dateDiff(budget.from, Date.now()) + 1;
    }

    static getDaysTotal (budget: Budget) {
        return dateDiff(budget.from, budget.to);
    }

    static getAverage (budget: Budget, totalExpenses: number) {
        const days = StatsStore.getDays(budget);
        if (days > 0 && totalExpenses > 0) {
            return totalExpenses > 0 ? Math.round(totalExpenses / days) : 0;
        } else {
            return 0;
        }
    }
}
