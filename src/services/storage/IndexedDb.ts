import { DbItem, SubStorageApi } from "./StorageApi";
import { openDB, IDBPDatabase, DBSchema, IDBPTransaction, IDBPObjectStore } from 'idb';
import { Budget, Category, Expense, BudgetsMap, ExpensesMap, CategoriesMap, ExportDataSet, EntityNames } from "../../api";
import { DateDay } from "../../domain/DateDay";

const TOO_OLD_MS = 3600000 * 24 * 7;

interface ExpenseDb extends Expense, DbItem { }
interface BudgetDb extends Budget, DbItem { }
interface CategoryDb extends Category, DbItem { }

const keyPath = { keyPath: 'identifier' };

interface Schema extends DBSchema {
    [EntityNames.Budgets]: {
        key: string,
        value: BudgetDb,
        indexes: { 
            'deleted, to': string, 
            'deleted, timestamp': [number, number] },
    },
    [EntityNames.Categories]: {
        value: CategoryDb,
        key: string,
        indexes: { 
            'deleted, name': string, 
            'deleted, timestamp': [number, number] },
    },
    [EntityNames.Expenses]: {
        value: ExpenseDb,
        key: string,
        indexes: { 
            'deleted, budgetId, when': [number, string, number], 
            'deleted, timestamp': [number, number] },
    }
}

export class IndexedDb implements SubStorageApi {
    private readonly name = 'budgetTrackerDb';
    private readonly version = 2;
    private _db?: IDBPDatabase<Schema>;

    // types of idb are wrong, contains method is not exposed in entry.ts
    private static contains(store: IDBPObjectStore<any, any, any>, indexName: string) {
        return (store.indexNames as any).contains(indexName);
    }

    private async createDb() {
        return openDB<Schema>(this.name, this.version, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.info(`Upgrading DB ${oldVersion} to ${newVersion}`);

                let budgetsStore;
                if (db.objectStoreNames.contains(EntityNames.Budgets)) {
                    budgetsStore = transaction.objectStore(EntityNames.Budgets);
                } else {
                    budgetsStore = db.createObjectStore(EntityNames.Budgets, keyPath);
                }

                if (!IndexedDb.contains(budgetsStore, 'deleted, to')) {
                    budgetsStore.createIndex('deleted, to', ['deleted', 'to']);
                }
                if (!IndexedDb.contains(budgetsStore, 'deleted, timestamp')) {
                    budgetsStore.createIndex('deleted, timestamp', ['deleted', 'timestamp']);
                }
                
                let categoriesStore;
                if (db.objectStoreNames.contains(EntityNames.Categories)) {
                    categoriesStore = transaction.objectStore(EntityNames.Categories);
                } else {
                    categoriesStore = db.createObjectStore(EntityNames.Categories, keyPath);
                }
                if (!IndexedDb.contains(categoriesStore, 'deleted, name')) {
                    categoriesStore.createIndex('deleted, name', ['deleted', 'name']);
                }
                if (!IndexedDb.contains(categoriesStore, 'deleted, timestamp')) {
                    categoriesStore.createIndex('deleted, timestamp', ['deleted', 'timestamp']);
                }
                
                let expensesStore;
                if (db.objectStoreNames.contains(EntityNames.Expenses)) {
                    expensesStore = transaction.objectStore(EntityNames.Expenses);
                } else {
                    expensesStore = db.createObjectStore(EntityNames.Expenses, keyPath);
                }
                if (!IndexedDb.contains(expensesStore, 'deleted, budgetId, when')) {
                    expensesStore.createIndex('deleted, budgetId, when', ['deleted', 'budgetId', 'when']);
                }
                if (!IndexedDb.contains(expensesStore, 'deleted, timestamp')) {
                    expensesStore.createIndex('deleted, timestamp', ['deleted', 'timestamp']);
                }
            },
        });
    }

    async getDb() {
        if (this._db === undefined) {
            this._db = await this.createDb();
            this.cleanupOldDeleted();
        }
        return this._db;
    }

    async getBudgets(): Promise<BudgetsMap> {
        const db = await this.getDb();
        const bound = IDBKeyRange.upperBound([1, 0]);
        const budgetsResult = await db.getAllFromIndex(
            EntityNames.Budgets,
            'deleted, to',
            bound
        );
        const budgetMap: BudgetsMap = {}; 
        budgetsResult.forEach(b => budgetMap[b.identifier] = b);
        return budgetMap;
    }

    async getBudget(identifier: string) {
        const db = await this.getDb();
        return db.get(EntityNames.Budgets, identifier);
    }

    async setBudget(budget: Budget, timestamp: number) {
        const db = await this.getDb();
        await db.put(
            EntityNames.Budgets,
            {
                deleted: 0,
                timestamp,
                ...budget
            });
        return this.setLastTimeSaved(timestamp);
    }

    async deleteBudget(budgetId: string, timestamp = Date.now()) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Budgets, 'readwrite');
        const budget = await tx.store.get(budgetId);
        if (budget) {
            tx.store.put({
                ...budget,
                deleted: 1,
                timestamp,
            });
        }
        await tx.done;
        this.setLastTimeSaved(timestamp);
    }

    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        const db = await this.getDb();
        const budget = await db.get(EntityNames.Budgets, budgetId);
        if (budget) {
            const topDate = DateDay.fromTimeMs(budget.to).addYears(3).timeMs;
            const bound = IDBKeyRange.bound(
                [0, budgetId, 0],
                [0, budgetId, topDate]);
            const expensesResult = await db.getAllFromIndex(
                EntityNames.Expenses,
                'deleted, budgetId, when',
                bound
            );
            const expenses: ExpensesMap = {};
            expensesResult.forEach(e => expenses[e.identifier] = e);
            return expenses;
        }
        throw new Error('There is no budget with id ' + budgetId);
    }

    private async getAllExpenses(): Promise<ExpensesMap> {
        const db = await this.getDb();
        const expenses = await db.getAll(EntityNames.Expenses);
        const expensesMap: ExpensesMap = {};
        expenses.forEach(e => expensesMap[e.identifier] = e);
        return expensesMap;
    }

    async getExpense(expenseId: string) {
        const db = await this.getDb();
        return db.get(EntityNames.Expenses, expenseId);
    }

    async setExpenses(expenses: Expense[], timestamp: number) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Expenses, 'readwrite');
        for (const expense of expenses) {
            tx.store.put({
                ...expense,
                timestamp,
                deleted: 0
            });
        }
        await tx.done;
        return this.setLastTimeSaved(timestamp);
    }

    async deleteExpense(expenseId: string, timestamp: number) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Expenses, 'readwrite');
        const expense = await tx.store.get(expenseId);
        if (expense) {
            tx.store.put({ ...expense, deleted: 1, timestamp });
        }
        await tx.done;
        return this.setLastTimeSaved(timestamp);
    }

    async getCategories(): Promise<CategoriesMap> {
        const db = await this.getDb();
        const bound = IDBKeyRange.upperBound([1,], true);
        const categoriesResult = await db.getAllFromIndex(
            EntityNames.Categories,
            'deleted, name',
            bound);
        const categories: CategoriesMap = {};
        if (categoriesResult) {
            categoriesResult.forEach(c => categories[c.identifier] = c);
        }
        return categories;
    }

    async setCategories(categories: Category[], timestamp: number) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Categories, 'readwrite');
        for (const category of categories) {
            tx.store.put({
                ...category,
                timestamp,
                deleted: 0
            });
        }
        await tx.done;
        return this.setLastTimeSaved(timestamp);
    }

    async getCategory(identifier: string) {
        const db = await this.getDb();
        return db.get(EntityNames.Categories, identifier);
    }

    async deleteCategory(identifier: string, timestamp: number) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Categories, 'readwrite');
        const category = await tx.store.get(identifier);
        if (category) {
            tx.objectStore(EntityNames.Categories).put({ ...category, timestamp, deleted: 1 });
        }
        await tx.done;
        return this.setLastTimeSaved(timestamp);
    }

    async import(data: ExportDataSet) {
        const db = await this.getDb();
        const tx = db.transaction(
            [EntityNames.Budgets, EntityNames.Categories, EntityNames.Expenses],
            'readwrite');

        const dbProps: DbItem = {
            deleted: 0,
            timestamp: data.lastTimeSaved
        };

        for (const budgetId in data.budgets) {
            tx.objectStore(EntityNames.Budgets).put(
                { ...dbProps, ...data.budgets[budgetId] });
        }
        for (const expenseId in data.expenses) {
            tx.objectStore(EntityNames.Expenses)
                .put({ ...dbProps, ...data.expenses[expenseId] });
        }
        for (const categoryId in data.categories) {
            tx.objectStore(EntityNames.Categories).put(
                { ...dbProps, ...data.categories[categoryId] });
        }
        await tx.done;
        return this.setLastTimeSaved(data.lastTimeSaved);
    }

    async export(): Promise<ExportDataSet> {
        const [budgets, categories, expenses, lastTimeSaved] = await Promise.all([
            this.getBudgets(),
            this.getCategories(),
            this.getAllExpenses(),
            this.getLastTimeSaved()
        ]);
        return {
            budgets,
            expenses,
            categories,
            lastTimeSaved
        };
    }

    async getLastTimeSaved(): Promise<number> {
        return parseInt(localStorage.getItem('timestamp') || '0');
    }
    async setLastTimeSaved(timestamp: number): Promise<void> {
        localStorage.setItem('timestamp', timestamp.toString());
    }

    private async keysToDelete (tx: IDBPTransaction<Schema, EntityNames[]>): Promise<Map<EntityNames, string[]>> {
        const threshold = Date.now() - TOO_OLD_MS;
        const keyRange =  IDBKeyRange.bound([1, 0], [1, threshold]);
        const indexName = 'deleted, timestamp';
        const keyMap = new Map();
        for (const name of Object.values(EntityNames)) {
            keyMap.set(name, await tx.db.getAllKeysFromIndex(name, indexName, keyRange));
        }
        return keyMap;
    }

    private async cleanupOldDeleted () {
        const db = await this.getDb();
        const tx = db.transaction(
            [EntityNames.Budgets, EntityNames.Categories, EntityNames.Expenses],
            'readwrite');
        const keyMap = await this.keysToDelete(tx);
        console.debug('Cleaning deleted old entities: ', keyMap);

        keyMap.forEach((keys, name) => (
            keys.forEach(k => tx.objectStore(name).delete(k))));

        return tx.done;
    }
}
