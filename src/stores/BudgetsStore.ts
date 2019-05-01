
export interface Budget {
    identifier: string;
    name: string;
}

class BudgetsStore {

    private budgets: Budget[];

    async getBudgets() {
        if (this.budgets === undefined) {
            return this.fetchBudgets();
        }

        return this.budgets;
    }

    async fetchBudgets() {
        this.budgets = [
            {name: 'A', identifier: 'a'}, 
            {name: 'B', identifier: 'b'}
        ]; 
        return Promise.resolve(this.budgets);
    }
}

export const budgetsStore = new BudgetsStore();
