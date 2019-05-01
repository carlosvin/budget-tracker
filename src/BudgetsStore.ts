import { Budget, Expense } from "./interfaces";
import { slugify } from "./utils";

class BudgetsStore {

    private budgets: {[identifier: string]: Budget};
    private expenses: {[identifier: string]: Expense};

    constructor(){
        console.log('Instantiate store');
    }

    async getBudgets(): Promise<Budget[]> {
        if (this.budgets === undefined) {
            return this.fetchBudgets();
        }

        return Object.values(this.budgets);
    }

    async getBudget(identifier: string): Promise<Budget>{
        if (this.budgets && identifier in this.budgets) {
            return this.budgets[identifier];
        }
        return null;
    }

    async getExpenses(identifier: string) {
        if (this.expenses === undefined) {
            return this.fetchExpenses(identifier);
        }
        return this.expenses;
    }

    private async fetchExpenses(identifier: string) {
        this.expenses = {
            100000: this.createExpense(100, 'SIM Card ' + identifier),
            200000: this.createExpense(25, 'Dinner'),
            300000: this.createExpense(44, 'Lunch')
        };
        return Object.values(this.expenses);
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
            from: new Date(2019, 14, 1),
            to: new Date(2019, 2, 6),
            total: name.length * 1000,
            currency: 'EUR'
        };
    }

    private createExpense(amount: number, desc: string): Expense {
        return {
            amount: amount,
            currency: 'USD',
            category: desc.slice(0, 10),
            description: desc
        };
    }
}

export const budgetsStore = new BudgetsStore();
