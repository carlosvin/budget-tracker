import { Budget, Expense, ImportedExpense } from "../interfaces";
import { FilesApi } from "../api/FileApi";
import { uuid } from "../utils";

class BudgetsStore {

    private static readonly KEY_BUDGETS = 'budgets';
    private static readonly KEY_EXPENSES = 'expenses';
    
    private budgets: {[identifier: string]: Budget};
    private expenses: {[identifier: string]: {[identifier: string]: Expense}};

    constructor(){
        console.log('Instantiate store');
    }

    async getBudgets(): Promise<Budget[]> {
        if (this.budgets === undefined) {
            return this.fetchBudgets();
        }

        return Object.values(this.budgets);
    }

    async getBudget(identifier: string): Promise<Budget> {
        if (this.budgets === undefined) {
            await this.fetchBudgets();
        }
        if (identifier in this.budgets) {
            return this.budgets[identifier];
        }
        return null;
    }

    async setBudget(budget: Budget) {
        if (this.budgets === undefined) {
            await this.fetchBudgets();
        }
        this.budgets[budget.identifier] = budget;
        await this.saveBudgets();
    }

    async getExpenses(identifier: string) {
        if (this.expenses === undefined) {
            return this.fetchExpenses(identifier);
        }
        return this.expenses[identifier];
    }

    async getExpense(budgetId: string, expenseId: string) {
        if (this.expenses === undefined) {
            await this.fetchExpenses(budgetId);
        }
        return this.expenses[budgetId][expenseId];
    }

    async deleteExpense (budgetId: string, expenseId: string) {
        if (this.expenses && budgetId in this.expenses) {
            delete this.expenses[budgetId][expenseId];
            this.saveExpenses();
        }
    }

    async deleteBudget (budgetId: string) {
        if (budgetId in this.budgets) {
            delete this.budgets[budgetId];
            this.saveBudgets();
        }
        if (budgetId in this.expenses) {
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
        if (this.expenses === undefined) {
            const serializedExpenses = localStorage.getItem(BudgetsStore.KEY_EXPENSES);
            if (serializedExpenses) {
                this.expenses = JSON.parse(serializedExpenses);
            } else {
                this.expenses = {};
                this.expenses[identifier] = {};
                return null;
            }
        }
        
        return this.expenses[identifier];
    }

    private async fetchBudgets() {
        if (this.budgets === undefined) {
            const serializedBudgets = localStorage.getItem(BudgetsStore.KEY_BUDGETS);
            if (serializedBudgets) {
                this.budgets = JSON.parse(serializedBudgets);
            } else {
                this.budgets = {};
            }
        }
        return Object.values(this.budgets);
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
