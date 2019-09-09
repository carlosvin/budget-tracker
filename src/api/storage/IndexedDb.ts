import { SubStorageApi } from "./StorageApi";
import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Budget, Category, Expense, BudgetsMap, ExpensesMap, Categories, ExportDataSet } from "../../interfaces";

interface DbItem {
    deleted: number;
    timestamp: number;
}

interface ExpenseDb extends Expense, DbItem {
    budgetId: string;
}
interface BudgetDb extends Budget, DbItem { }
interface CategoryDb extends Category, DbItem { }

enum StoreNames {
    Budgets = 'budgets',
    Expenses = 'expenses',
    Categories = 'categories'
}

const keyPath = {keyPath: 'identifier'};

interface Schema extends DBSchema {
    [StoreNames.Budgets]: {
        key: string,
        value: BudgetDb,
        indexes: { 'deleted, to': string },
    },
    [StoreNames.Categories]: {
        value: CategoryDb,
        key: string,
        indexes: { 'deleted, name': string },
    },
    [StoreNames.Expenses]: {
        value: ExpenseDb,
        key: string,
        indexes: { 'deleted, budgetId, when': [number, string, number]},
    }
}

export class IndexedDb implements SubStorageApi {
    private readonly name = 'budgetTrackerDb';
    private readonly version = 1;
    private _db?: IDBPDatabase<Schema>;

    private async createDb() {
        return openDB<Schema>(this.name, this.version, {
            upgrade(db) {
                const budgetsStore = db.createObjectStore(StoreNames.Budgets, keyPath);
                budgetsStore.createIndex('deleted, to', ['deleted', 'to']);

                const categoriesStore = db.createObjectStore(StoreNames.Categories, keyPath);
                categoriesStore.createIndex('deleted, name', ['deleted', 'name']);
                
                const expensesStore = db.createObjectStore(StoreNames.Expenses, keyPath);
                expensesStore.createIndex('deleted, budgetId, when', ['deleted', 'budgetId', 'when']);
            },
        });
    }

    async getDb() {
        if (this._db === undefined) {
            this._db = await this.createDb();
        }
        return this._db;
    }

    async getBudgets(): Promise<BudgetsMap> {
        const db = await this.getDb();
        const budgetsResult = await db.getAll(StoreNames.Budgets);
        const budgets: BudgetsMap = {};
        // TODO apply the filtering in indexed DB instead of programatically
        budgetsResult.filter(b => !b.deleted).forEach(b => budgets[b.identifier] = b);
        return budgets;
    }

    async saveBudget(budget: Budget, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        await db.put(StoreNames.Budgets, {deleted: 0, timestamp, ...budget});
    }

    async deleteBudget(budgetId: string, timestamp=new Date().getTime()) {
        const db = await this.getDb();
        const tx = db.transaction(StoreNames.Budgets, 'readwrite');
        const budget = await tx.store.get(budgetId);
        if (budget) {
            tx.store.put({ ...budget, deleted: 1, timestamp });
        }
        return tx.done;
    }

    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        const db = await this.getDb();
        const budget = await db.get(StoreNames.Budgets, budgetId);
        if (budget) {
            const bound = IDBKeyRange.bound(
                [0, budgetId, budget.from],
                [0, budgetId, budget.to]);
            const expensesResult = await db.getAllFromIndex(
                StoreNames.Expenses, 
                'deleted, budgetId, when',
                bound
            );
            const expenses: ExpensesMap = {};
            expensesResult.forEach(e => expenses[e.identifier] = e);
            return expenses;
        }
        throw new Error('There is no budget with id ' + budgetId);
    }

    async saveExpenses(budgetId: string, expenses: Expense[], timestamp = new Date().getTime()) {
        const db = await this.getDb();
        const tx = db.transaction(StoreNames.Expenses, 'readwrite');
        for (const expense of expenses) {
            tx.store.put({...expense, timestamp, deleted: 0, budgetId});
        }
        return tx.done;
    }

    async deleteExpense(budgetId: string, expenseId: string, timestamp = new Date().getTime()) {
        // TODO budgetId is not required here, maybe we can just remove it from interface if it is note required in remote implementation
        const db = await this.getDb();
        const tx = db.transaction(StoreNames.Expenses, 'readwrite');
        const expense = await tx.store.get(expenseId);
        if (expense) {
            tx.store.put({ ...expense, deleted: 1, timestamp });
        }
        return tx.done;
    }

    async getCategories(): Promise<Categories> {
        const db = await this.getDb();
        const bound = IDBKeyRange.lowerBound([0, ]);
        const categoriesResult = await db.getAllFromIndex(
            StoreNames.Categories, 
            'deleted, name', 
            bound);
        const categories: Categories = {};
        if (categoriesResult) {
            categoriesResult.forEach(c => categories[c.identifier] = c);
        }
        return categories;
    }

    async saveCategory(category: Category, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        await db.put(StoreNames.Categories, {...category, timestamp, deleted: 0});
    }

    async saveCategories(categories: Categories, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        const tx = db.transaction(StoreNames.Categories, 'readwrite');
        for (const id in categories) {
            tx.store.put({deleted: 0, ...categories[id], timestamp });
        }
        return tx.done;
    }

    async import(data: ExportDataSet) {
        const db = await this.getDb();
        const tx = db.transaction(
            [StoreNames.Budgets, StoreNames.Categories, StoreNames.Expenses], 
            'readwrite');

        const dbProps = { deleted: 0, timestamp: data.lastTimeSaved };

        for (const budgetId in data.budgets) {
            tx.objectStore(StoreNames.Budgets).put(
                {...dbProps, ...data.budgets[budgetId]});
            for (const expenseId in data.expenses[budgetId]) {
                tx.objectStore(StoreNames.Expenses)
                    .put({...dbProps, budgetId, ...data.expenses[budgetId][expenseId]});
            }
        }
        for (const categoryId in data.categories) {
            tx.objectStore(StoreNames.Categories).put(
                {...dbProps, ...data.categories[categoryId]});
        }
        return tx.done;
    }

    async export(): Promise<ExportDataSet> {
        const [budgets, categories] = await Promise.all([this.getBudgets(), this.getCategories()]);
        const expenses: { [budgetId: string]: ExpensesMap } = {};
        for (const budgetId in budgets) {
            expenses[budgetId] = await this.getExpenses(budgetId);
        }
        return {
            budgets,
            expenses,
            categories,
            // TODO review granularity level for timestamp, maybe per entity
            lastTimeSaved: 0
        };
    }

    async getLastTimeSaved(): Promise<number> {
        return parseInt(localStorage.getItem('timestamp') || '0');
    }
    async setLastTimeSaved(timestamp: number): Promise<void> {
        localStorage.setItem('timestamp', timestamp.toString());
    }
}