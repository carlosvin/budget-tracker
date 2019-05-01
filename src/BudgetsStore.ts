import { Budget } from "./interfaces";

class BudgetsStore {

    private budgets: Budget[];

    async getBudgets() {
        if (this.budgets === undefined) {
            return this.fetchBudgets();
        }

        return this.budgets;
    }

    private async fetchBudgets() {
        return [
            this.createBudget_tmpRemove('Asia'),
            this.createBudget_tmpRemove('LATAM'),
            this.createBudget_tmpRemove('Road trip ES')
        ];
    }

    private createBudget_tmpRemove(name: string): Budget {
        return {
            identifier: name,
            name: name,
            from: new Date(2019, 14, 1),
            to: new Date(2019, 2, 6),
            total: name.length * 1000,
            currency: 'EUR'
        };
    }
}

export const budgetsStore = new BudgetsStore();
