import { Budget, Expense } from "../interfaces";
import { slugify } from "../utils";

class BudgetsStore {

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

    setBudget = (budget: Budget) => {
        if (this.budgets === undefined) {
            this.fetchBudgets();
        }
        this.budgets[budget.identifier] = budget;
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

    deleteExpense (identifier: string, timestamp: number) {
        if (this.expenses) {
            delete this.expenses[identifier][timestamp];
        }
    }

    saveExpense(identifier: string, expense: Expense){
        if (this.expenses) {
            this.expenses[identifier][expense.creation.getTime()] = expense;
        }
    }

    private async fetchExpenses(identifier: string) {
        if (this.expenses === undefined) {
            this.expenses = {};
            this.expenses[identifier] = {};
            let a = this.createExpense(100, 'SIM Card ' + identifier);
            this.expenses[identifier][a.creation.getTime()] = a;
            a = this.createExpense(200, 'Lunch');
            this.expenses[identifier][a.creation.getTime()] = a;
        }
        
        return this.expenses[identifier];
    }

    private async fetchBudgets() {
        this.budgets = {
            'asia': this.createBudget('Asia'),
            'latam': this.createBudget('LATAM'),
            'road-trip-es': this.createBudget('Road trip ES')
        };
        return Object.values(this.budgets);
    }

    // TODO remove
    private createBudget(name: string): Budget {
        return {
            identifier: slugify(name),
            name: name,
            from: new Date(2019, 1, 1),
            to: new Date(2019, 6, 6),
            total: name.length * 1000,
            currency: 'EUR'
        };
    }

    private createExpense(amount: number, desc: string): Expense {
        return {
            amount: amount,
            currency: 'USD',
            category: desc.slice(0, 10),
            description: desc,
            when: new Date(amount * 110000000),
            creation: new Date(amount * 100000001),
            
        };
    }
}

export const budgetsStore = new BudgetsStore();
