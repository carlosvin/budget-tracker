import { Budget, Expense, ImportedExpense } from "../interfaces";
import { FilesApi } from "../api/FileApi";
import { uuid } from "../utils";
import { currenciesStore } from "./CurrenciesStore";

export class BudgetsStore {

    private static readonly KEY_BUDGETS = 'budgets';
    private static readonly KEY_EXPENSES = 'expenses';
    
    private budgets?: {[identifier: string]: Budget};
    private expenses?: {[identifier: string]: {[identifier: string]: Expense}};

    constructor(){
        console.log('Instantiate store');
    }

    async getBudgets(): Promise<Budget[]> {
        if (this.budgets === undefined){
            this.budgets = await this.fetchBudgets();
        }

        if (this.budgets) {
            return Object.values(this.budgets);
        } 
        return [];
    }

    async getBudget(identifier: string): Promise<Budget> {
        if (this.budgets === undefined) {
            this.budgets = await this.fetchBudgets();
        }
        if (this.budgets && identifier in this.budgets) {
            return this.budgets[identifier];
        }
        throw new Error(`Budget nof found: ${identifier}`);
    }

    async setBudget(budget: Budget) {
        if (this.budgets === undefined) {
            await this.fetchBudgets();
        }
        if (!this.budgets) {
            this.budgets = {};
        }
        if (budget.identifier in this.budgets && 
            this.budgets[budget.identifier].currency !== budget.currency) {
            // currency was changed, so we have to recalculate expenses base amount
            await this.updateBaseAmount(budget.identifier, budget.currency);
        }
        this.budgets[budget.identifier] = budget;
        await this.saveBudgets();
    }

    private async updateBaseAmount(budgetId: string, baseCurrency: string) {
        if (this.expenses && budgetId in this.expenses) {
            const budgetExpenses = this.expenses[budgetId];
            for (const k in budgetExpenses) {
                budgetExpenses[k].amountBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
                    baseCurrency, 
                    budgetExpenses[k].currency, 
                    budgetExpenses[k].amount);
            }
        }
    }

    async getExpenses(identifier: string) {
        if (this.expenses === undefined) {
            return this.fetchExpenses(identifier);
        }
        return this.expenses[identifier];
    }

    async getExpense(budgetId: string, expenseId: string): Promise<Expense> {
        if (this.expenses) {
            return this.expenses[budgetId][expenseId];
        }
        const expenses = await this.fetchExpenses(budgetId);
        return expenses[expenseId];
    }

    async deleteExpense (budgetId: string, expenseId: string) {
        if (this.expenses && budgetId in this.expenses) {
            delete this.expenses[budgetId][expenseId];
            this.saveExpenses();
        }
    }

    async deleteBudget (budgetId: string) {
        if (this.budgets && budgetId in this.budgets) {
            delete this.budgets[budgetId];
            this.saveBudgets();
        }
        if (this.expenses && budgetId in this.expenses) {
            delete this.expenses[budgetId];
            this.saveExpenses();
        }
    }

    private async setExpense(budgetId: string, expense: Expense){
        if (!this.expenses) {
            this.expenses = {};
        }
        if (!(budgetId in this.expenses)) {
            this.expenses[budgetId] = {};
        }
        this.expenses[budgetId][expense.identifier] = expense;
    }

    async saveExpense (budgetId: string, expense: Expense) {
        this.setExpense(budgetId, expense);
        this.saveExpenses();
    }

    private async fetchExpenses(identifier: string) {
        const serializedExpenses = localStorage.getItem(BudgetsStore.KEY_EXPENSES);
        if (serializedExpenses) {
            this.expenses = JSON.parse(serializedExpenses);
        } else {
            this.expenses = {};
            this.expenses[identifier] = {};
        }

        if (this.expenses) {
            return this.expenses[identifier];
        } else {
            throw new Error('Fetching expenses');
        }
    }

    private async fetchBudgets(): Promise<{[identifier: string]: Budget}> {
        if (this.budgets === undefined) {
            const serializedBudgets = localStorage.getItem(BudgetsStore.KEY_BUDGETS);
            if (serializedBudgets) {
                return JSON.parse(serializedBudgets);
            }
        }
        return {};
    }

    private async saveBudgets () {
        if (this.budgets) {
            localStorage.setItem(BudgetsStore.KEY_BUDGETS, this.serializedBudgets);
        }
    }

    private async saveExpenses () {
        if (this.expenses) {
            localStorage.setItem(BudgetsStore.KEY_EXPENSES, this.serializedExpenses);
        }
    }

    private get serializedBudgets () {
        return JSON.stringify(this.budgets);
    }

    private get serializedExpenses () {
        return JSON.stringify(this.expenses);
    }

    async importBudget(file: File){
        const content = await FilesApi.getFileContent(file);
        const importedExpenses = JSON.parse(content) as ImportedExpense[];
        const expenses = importedExpenses.map(e => BudgetsStore.convertToExpense(e));
        const budget: Budget = {
            currency: importedExpenses[0].homeCurrency,
            from: expenses[expenses.length - 1].when,
            to: expenses[0].when,
            identifier: importedExpenses[0].tripId,
            name: `Imported ${importedExpenses[0].homeCurrency}`,
            total: importedExpenses.map(e => parseFloat(e.amountInHomeCurrency)).reduce((a, total) => a + total)
        };
        this.setBudget(budget);
        expenses.sort((a, b) => a.when < b.when ? -1 : 1);
        expenses.forEach(e => this.setExpense(budget.identifier, e));
        this.saveExpenses();
    }

    static convertToExpense(imported: ImportedExpense): Expense {
        const dateParts = imported.datePaid.split('-').map(d => parseInt(d));
        const timestamp = new Date(dateParts[2], dateParts[1], dateParts[0]).getTime();
        const expense: Expense = {
            amount: parseFloat(imported.amount),
            amountBaseCurrency: parseFloat(imported.amountInHomeCurrency),
            categoryId: imported.categoryId, 
            countryCode: imported.countryCode,
            identifier: uuid(),
            currency: imported.localCurrency,
            description: imported.notes,
            when: timestamp
        };
        return expense;
    }
}

export const budgetsStore = new BudgetsStore();
