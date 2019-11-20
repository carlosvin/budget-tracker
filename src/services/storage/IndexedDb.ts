import { DbItem, SubStorageApi } from "./StorageApi";
import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Budget, Category, Expense, BudgetsMap, ExpensesMap, CategoriesMap, ExportDataSet, EntityNames } from "../../api";
import { DateDay } from "../../domain/DateDay";

interface ExpenseDb extends Expense, DbItem { }
interface BudgetDb extends Budget, DbItem { }
interface CategoryDb extends Category, DbItem { }

const keyPath = { keyPath: 'identifier' };

interface Schema extends DBSchema {
    [EntityNames.Budgets]: {
        key: string,
        value: BudgetDb,
        indexes: { 'deleted, to': string },
    },
    [EntityNames.Categories]: {
        value: CategoryDb,
        key: string,
        indexes: { 'deleted, name': string },
    },
    [EntityNames.Expenses]: {
        value: ExpenseDb,
        key: string,
        indexes: { 'deleted, budgetId, when': [number, string, number] },
    }
}

export class IndexedDb implements SubStorageApi {
    private readonly name = 'budgetTrackerDb';
    private readonly version = 1;
    private _db?: IDBPDatabase<Schema>;

    private async createDb() {
        return openDB<Schema>(this.name, this.version, {
            upgrade(db) {
                if (!(EntityNames.Budgets in db.objectStoreNames)) {
                    const budgetsStore = db.createObjectStore(EntityNames.Budgets, keyPath);
                    budgetsStore.createIndex('deleted, to', ['deleted', 'to']);    
                }

                if (!(EntityNames.Categories in db.objectStoreNames)) {
                    const categoriesStore = db.createObjectStore(EntityNames.Categories, keyPath);
                    categoriesStore.createIndex('deleted, name', ['deleted', 'name']);
                }

                if (!(EntityNames.Expenses in db.objectStoreNames)) {
                    const expensesStore = db.createObjectStore(EntityNames.Expenses, keyPath);
                    expensesStore.createIndex('deleted, budgetId, when', ['deleted', 'budgetId', 'when']);
                }
            },
        });
    }

    private async enablePersistentStorage(){
        const {storage} = navigator;
        const persistent = storage && storage.persist && await storage.persist();
        if (persistent) {
            console.info("Storage will not be cleared except by explicit user action");
        } else {
            console.warn("Storage may be cleared by the UA under storage pressure.")
        }
    }

    async getDb() {
        if (this._db === undefined) {
            await this.enablePersistentStorage();
            this._db = await this.createDb();
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
}
