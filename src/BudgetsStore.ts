import { Budget } from './interfaces';

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
            description: `Description for ${name}`,
            from: new Date('5 Ago, 2019'),
            to: new Date('1 Dec, 2019')
        };
    }
}

export const budgetsStore = new BudgetsStore();
