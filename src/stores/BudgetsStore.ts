import { Budget, Expense } from "../interfaces";

class BudgetsStore {

    private static readonly KEY_BUDGETS = 'budgets';
    private static readonly KEY_EXPENSES = 'expenses';
    
    private budgets: {[identifier: string]: Budget};
    private expenses: {[identifier: string]: {[timestamp: number]: Expense}};

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

    async getExpense(identifier: string, timestamp: number) {
        if (this.expenses === undefined) {
            await this.fetchExpenses(identifier);
        }
        return this.expenses[identifier][timestamp];
    }

    async deleteExpense (identifier: string, timestamp: number) {
        if (this.expenses && identifier in this.expenses) {
            delete this.expenses[identifier][timestamp];
            this.saveExpenses();
        }
    }

    async setExpense(identifier: string, expense: Expense){
        if (this.expenses) {
            this.expenses[identifier][expense.creation] = expense;
        }
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
}

export const budgetsStore = new BudgetsStore();
