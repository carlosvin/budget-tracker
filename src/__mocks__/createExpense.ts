import { Budget, Expense } from "../interfaces";

export function createExpense (id: string, budget: Budget): Expense {
    return {
        amount: 100,
        amountBaseCurrency: 98,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: id,
        when: budget.from,
        budgetId: budget.identifier,
        splitInDays: 1
    };
}
