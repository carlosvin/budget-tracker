import { Budget, Expense } from "../interfaces";
import { BudgetModel } from "../domain/BudgetModel";
import { BudgetsIndexStore } from "./BudgetsIndexStore";
import { BudgetsStore, CurrenciesStore } from "./interfaces";

export default class BudgetsStoreImpl implements BudgetsStore {

    private readonly _currenciesStore: CurrenciesStore;
    private readonly _budgetsIndex: BudgetsIndexStore;
    private _budgetModels: {[identifier: string]: BudgetModel};

    constructor (budgetsIndex: BudgetsIndexStore, currenciesStore: CurrenciesStore) {
        this._currenciesStore = currenciesStore;
        this._budgetsIndex = budgetsIndex;
        this._budgetModels = {};
    }

    async getBudgetModel(budgetId: string) {
        if (!(budgetId in this._budgetModels)) {
            const [budget, expenses] = await Promise.all([
                this._budgetsIndex.getBudgetInfo(budgetId),
                this._budgetsIndex.getExpenses(budgetId)
            ]);
            this._budgetModels[budgetId] = new BudgetModel(
                budget,
                expenses
            );
        }
        return this._budgetModels[budgetId];
    }

    async setBudget(budget: Budget) {
        if (budget.identifier in this._budgetModels) {
            const budgetInfo = await this._budgetsIndex.getBudgetInfo(budget.identifier);
            let rates = undefined;
            if (budgetInfo.currency !== budget.currency) {
                rates = await this._currenciesStore.getRates(budget.currency);
            }
            this._budgetModels[budget.identifier].setBudget(budget, rates);
        } else {
            this._budgetModels[budget.identifier] = new BudgetModel(budget, {});
        }
        return this._budgetsIndex.setBudgetInfo(budget); 
    }

    async getExpenses(budgetId: string) {
        const budgetModel = await this.getBudgetModel(budgetId);
        return budgetModel.expenses;
    }

    async getExpensesByDay(budgetId: string, y: number, m: number, d: number) {
        const budgetModel = await this.getBudgetModel(budgetId);
        if (budgetModel.expenseGroups) {
            return budgetModel.expenseGroups[y][m][d];
        }
        throw new Error('No expenses found');
    }

    async saveExpenses(budgetId: string, expenses: Expense[]) {
        const model = await this.getBudgetModel(budgetId);
        for (const expense of expenses) {
            model.setExpense(expense);
        }
        this._budgetsIndex.saveExpenses(budgetId, expenses);
    }

    async getExpense(budgetId: string, expenseId: string){
        return (await this.getBudgetModel(budgetId)).getExpense(expenseId);
    }

    async deleteBudget(budgetId: string) {
        if (budgetId in this._budgetModels) {
            delete this._budgetModels[budgetId];
        }
        return this._budgetsIndex.deleteBudget(budgetId);
    }

    async deleteExpense(budgetId: string, expenseId: string) {
        const model = await this.getBudgetModel(budgetId);
        model.deleteExpense(expenseId);
        return this._budgetsIndex.deleteExpense(budgetId, expenseId);
    }
}
