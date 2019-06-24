import { BudgetsStore, budgetsStore } from './stores/BudgetsStore';
import { Expense } from './interfaces';
import { BudgetModel } from './BudgetModel';
import { currenciesStore } from './stores/CurrenciesStore';

export class Migrator {

    private static readonly MIGRATION_KEY = 'budget-tracker-migration-status';
    private static readonly MIGRATION_VALUE = 'migration-fixing-v1-completed';

    static shouldMigrateToV1 () {
        return localStorage.getItem(this.MIGRATION_KEY) !== this.MIGRATION_VALUE;
    }

    static async migrateToV1 () {
        const serializedExpenses = localStorage.getItem(BudgetsStore.KEY_EXPENSES);
        if (serializedExpenses) {
            const allExpenses: { [budgetId: string]: {[expenseId: string]: Expense} } = JSON.parse(serializedExpenses);
            for (const budgetId in allExpenses) {
                const budgetExpenses = allExpenses[budgetId]
                for (const expenseId in budgetExpenses) {
                    const expense = budgetExpenses[expenseId];
                    try {
                        BudgetModel.validateExpense(expense);
                    } catch (error) {
                        console.log('Fixing expense during migration: ', expense);
                        await this.fix(expense, budgetsStore.getBudgetInfo(budgetId).currency);
                        console.log('Expense fixed: ', expense);
                    }
                }
                budgetsStore.saveExpenses(budgetId, budgetExpenses);
            }
            localStorage.setItem(this.MIGRATION_KEY, this.MIGRATION_VALUE);
            console.info('Expenses migrated');
        }
    }

    private static async fix(expense: Expense, baseCurrency: string) {
        expense.amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
            baseCurrency,
            expense.currency, 
            expense.amount
        );
    }
}
