import { SubStorageApi } from "./StorageApi";
import { openDB, IDBPDatabase } from 'idb';
import { Budget, Category, Expense, BudgetsMap, ExpensesMap, Categories, ExportDataSet } from "../../interfaces";

interface StoreConfig {
    name: string;
    keyPath: string;
    indexName?: string;
    indexPath?: string;
}

interface DbConfig {
    name: string;
    version: number;
    budget: StoreConfig;
    category: StoreConfig;
    expense: StoreConfig;
}

interface DbItem {
    deleted: boolean;
}

interface ExpenseDb extends Expense, DbItem {
    budgetId: string;
}
interface BudgetDb extends Budget, DbItem {}
interface CategoryDb extends Expense, DbItem {}

export class IndexedDb implements SubStorageApi {
    private readonly config: DbConfig = {
        name: 'budgetTrackerDb',
        version: 1,
        budget: {
            name: 'budgets',
            keyPath: 'identifier',
            indexName: 'deleted',
            indexPath: 'deleted',
        },
        category: {
            name: 'categories',
            keyPath: 'id',
        },
        expense: {
            name: 'expenses',
            keyPath: 'identifier',
            indexName: 'budgetId',
            indexPath: 'budgetId'
        }
    };

    private _db?: IDBPDatabase<DbConfig>;

    private async createDb() {
        const {name, version, budget, expense, category} = this.config;
        return openDB<DbConfig>(name, version, {
            upgrade(db) {
                IndexedDb.createStore(budget, db);
                IndexedDb.createStore(expense, db);
                IndexedDb.createStore(category, db);
            },
        });
    }

    private static createStore (config: StoreConfig, db: IDBPDatabase<DbConfig>) {
        const {name, keyPath, indexName, indexPath} = config;
        const store = db.createObjectStore(name, {keyPath: keyPath,});
        if (indexName && indexPath) {
            store.createIndex(indexName, indexPath);
        }
    }

    async getDb () {
        if (this._db === undefined) {
            this._db = await this.createDb();
        }
        return this._db;
    }

    async getBudgets(): Promise<BudgetsMap> {
        const db = await this.getDb();
        const {name, indexName} = this.config.budget;
        if (indexName) {
            const budgetsResult = await db.getAll(name);
            const budgets: BudgetsMap = {};
            // TODO apply the filtering in indexed DB instead of programatically
            budgetsResult.filter(b => !b.deleted).forEach(b => budgets[b.identifier] = b);
            return budgets;
        }
        throw new Error('There are no budgets');
    }

    async saveBudget(budget: BudgetDb, timestamp?: number) {
        const db = await this.getDb();
        const {name} = this.config.budget;
        await db.put(name, budget);
    }

    async deleteBudget(budgetId: string, timestamp?: number) {
        const db = await this.getDb();
        const {name} = this.config.budget;
        const tx = db.transaction(name, 'readwrite');
        const budget = await tx.store.get(budgetId);
        tx.store.put({...budget, deleted: true});
        return tx.done;
    }

    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        const db = await this.getDb();
        const {name, indexName} = this.config.expense;
        if (indexName) {
            const expensesResult = await db.getAllFromIndex(name, indexName, budgetId);
            const expenses: ExpensesMap = {};
            expensesResult.forEach(e => expenses[e.identifier] = e);
            return expenses;
        }
        return {};
        // TODO throw new Error('There are no expenses');
    }

    async saveExpenses(budgetId: string, expenses: Expense[], timestamp?: number) {
        const db = await this.getDb();
        const {name} = this.config.expense;
        const tx = db.transaction(name, 'readwrite');
        for (const expense of expenses) {
            tx.store.put(expense);
        }
        return tx.done;
    }

    async deleteExpense(budgetId: string, expenseId: string, timestamp?: number) {
        const db = await this.getDb();
        const {name} = this.config.expense;
        const tx = db.transaction(name, 'readwrite');
        const expense = await tx.store.get(expenseId);
        tx.store.put({...expense, deleted: true});
        return tx.done;
    }

    async getCategories(): Promise<Categories> {
        const db = await this.getDb();
        const {name, indexName} = this.config.category;
        if (indexName) {
            const categoriesResult = await db.getAllFromIndex(name, indexName);
            const categories: Categories = {};
            categoriesResult.forEach(c => categories[c.id] = c);
            return categories;
        }
        return {};
        // TODO throw new Error('There are no categories');
    }

    async saveCategory(category: Category, timestamp?: number) {
        const db = await this.getDb();
        const {name} = this.config.category;
        db.put(name, category);
    }

    async saveCategories(categories: Categories,timestamp?: number) {
        const db = await this.getDb();
        const {name} = this.config.category;
        const tx = db.transaction(name, 'readwrite');
        for (const id in categories) {
            tx.store.put(categories[id]);
        }
        return tx.done;
    }

    async import(data: ExportDataSet) {
        const db = await this.getDb();
        const tx = db.transaction([
            this.config.budget.name, 
            this.config.category.name, 
            this.config.expense.name], 'readwrite');

        for (const budgetId in data.budgets) {
            tx.objectStore(this.config.budget.name).put(data.budgets[budgetId]);
            for (const expenseId in data.expenses) {
                tx.objectStore(this.config.expense.name)
                    .put(data.expenses[budgetId][expenseId]);
            }
        }
        for (const categoryId in data.categories) {
            tx.objectStore(this.config.category.name).put(data.categories[categoryId]);
        }
        
        return tx.done;
    }

    async export(): Promise<ExportDataSet> {
        const [budgets, categories] = await Promise.all([this.getBudgets(), this.getCategories()]);
        const expenses: {[budgetId: string]: ExpensesMap } = {};
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