import { Budget, Expense } from "../api";
import { BudgetModel } from "./BudgetModel";
import { BudgetModelImpl } from "./BudgetModelImpl";

export class BudgetModelCombined extends BudgetModelImpl {

    constructor(budgetModels: BudgetModel []) {
        super(
            BudgetModelCombined.combine(budgetModels), 
            BudgetModelCombined.combineExpenses(budgetModels.map(b => b.expenses)));
    }

    private static combine(budgets: Budget[]): Budget {
        return {
            identifier: budgets.map(b => b.identifier).join('+'),
            currency: budgets[0].currency,
            from: budgets.map(b => b.from).reduce((a, b) => Math.min(a, b)),
            to: budgets.map(b => b.to).reduce((a, b) => Math.max(a, b)),
            name: budgets.map(b => b.name).join('+'),
            total: budgets.map(b => b.total).reduce((a, b) => a + b)
        };
    }

    private static combineExpenses(expenses: Iterable<Expense>[]): Iterable<Expense> {
        return expenses.reduce((a, b) => ([...a, ...b]));
    }

}
