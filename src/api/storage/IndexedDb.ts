import { SyncItem, DbItem, SubStorageApi } from "./StorageApi";
import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Budget, Category, Expense, BudgetsMap, ExpensesMap, Categories, ExportDataSet, EntityNames } from "../../interfaces";

interface ExpenseDb extends Expense, DbItem { }
interface BudgetDb extends Budget, DbItem { }
interface CategoryDb extends Category, DbItem { }

const keyPath = {keyPath: 'identifier'};

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
    },
    Pending: {
        value: SyncItem,
        key: string,
    },
}

export class IndexedDb implements SubStorageApi {
    private readonly name = 'budgetTrackerDb';
    private readonly version = 1;
    private _db?: IDBPDatabase<Schema>;

    private async createDb() {
        return openDB<Schema>(this.name, this.version, {
            upgrade(db) {
                const budgetsStore = db.createObjectStore(EntityNames.Budgets, keyPath);
                budgetsStore.createIndex('deleted, to', ['deleted', 'to']);

                const categoriesStore = db.createObjectStore(EntityNames.Categories, keyPath);
                categoriesStore.createIndex('deleted, name', ['deleted', 'name']);
                
                const expensesStore = db.createObjectStore(EntityNames.Expenses, keyPath);
                expensesStore.createIndex('deleted, budgetId, when', ['deleted', 'budgetId', 'when']);

                db.createObjectStore('Pending', keyPath);
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
        const budgetsResult = await db.getAll(EntityNames.Budgets);
        const budgets: BudgetsMap = {};
        // TODO apply the filtering in indexed DB instead of programmatically
        budgetsResult.filter(b => !b.deleted).forEach(b => budgets[b.identifier] = b);
        return budgets;
    }

    async getBudget(identifier: string){
        const db = await this.getDb();
        return db.get(EntityNames.Budgets, identifier);
    }

    async saveBudget(budget: Budget, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        await db.put(
            EntityNames.Budgets, 
            {
                deleted: 0, 
                timestamp, 
                ...budget
            });
    }

    async deleteBudget(budgetId: string, timestamp=new Date().getTime()) {
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
        return tx.done;
    }

    async getExpenses(budgetId: string): Promise<ExpensesMap> {
        const db = await this.getDb();
        const budget = await db.get(EntityNames.Budgets, budgetId);
        if (budget) {
            const bound = IDBKeyRange.bound(
                [0, budgetId, budget.from],
                [0, budgetId, budget.to]);
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

    private async getAllExpenses (): Promise<ExpensesMap> {
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

    async saveExpenses(expenses: Expense[], timestamp = new Date().getTime()) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Expenses, 'readwrite');
        for (const expense of expenses) {
            tx.store.put({
                ...expense, 
                timestamp, 
                deleted: 0});
        }
        return tx.done;
    }

    async deleteExpense(expenseId: string, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Expenses, 'readwrite');
        const expense = await tx.store.get(expenseId);
        if (expense) {
            tx.store.put({ ...expense, deleted: 1, timestamp });
        }
        return tx.done;
    }

    async getCategories(): Promise<Categories> {
        const db = await this.getDb();
        const bound = IDBKeyRange.upperBound([1, ], true);
        const categoriesResult = await db.getAllFromIndex(
            EntityNames.Categories, 
            'deleted, name', 
            bound);
        const categories: Categories = {};
        if (categoriesResult) {
            categoriesResult.forEach(c => categories[c.identifier] = c);
        }
        return categories;
    }

    async getCategory(identifier: string) {
        const db = await this.getDb();
        return db.get(EntityNames.Categories, identifier);
    }

    async saveCategory(category: Category, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        await db.put(
            EntityNames.Categories, 
            { ...category, timestamp, deleted: 0});
    }

    async deleteCategory(identifier: string, timestamp = new Date().getTime()) {
        const db = await this.getDb();
        const tx = db.transaction(EntityNames.Categories, 'readwrite');
        const category = await tx.store.get(identifier);
        if (category) {
            tx.store.put({...category, timestamp, deleted: 1});
        }
        return tx.done;    
    }

    async import(data: ExportDataSet) {
        const db = await this.getDb();
        const tx = db.transaction(
            [EntityNames.Budgets, EntityNames.Categories, EntityNames.Expenses], 
            'readwrite');

        const dbProps: DbItem = { 
            deleted: 0, 
            timestamp: data.lastTimeSaved };

        for (const budgetId in data.budgets) {
            tx.objectStore(EntityNames.Budgets).put(
                {...dbProps, ...data.budgets[budgetId]});
            for (const expenseId in data.expenses[budgetId]) {
                tx.objectStore(EntityNames.Expenses)
                    .put({...dbProps, budgetId, ...data.expenses[expenseId]});
            }
        }
        for (const categoryId in data.categories) {
            tx.objectStore(EntityNames.Categories).put(
                {...dbProps, ...data.categories[categoryId], identifier: categoryId});
        }
        return tx.done;
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

    async getPendingSync() {
        const db = await this.getDb();
        const pendingItems = await db.getAll('Pending');
        const data: ExportDataSet = {
            budgets: {}, expenses: {}, categories: {}, lastTimeSaved: await this.getLastTimeSaved()
        };
        for (const item of pendingItems) {
            if (item.type === EntityNames.Categories) {
                const category = await this.getCategory(item.identifier);
                if (category) {
                    data.categories[category.identifier] = category;
                }
            } else if (item.type === EntityNames.Budgets) {
                const budget = await this.getBudget(item.identifier);
                if (budget) {
                    data.budgets[budget.identifier] = budget;
                }
            } else if (item.type === EntityNames.Expenses) {
                const expense = await this.getExpense(item.identifier);
                if (expense) {
                    data.expenses[expense.identifier] = expense;
                }
            }
        }
        return data;
    }

    async cleanupPendingSync(pending: ExportDataSet) {
        const db = await this.getDb();
        const tx = db.transaction('Pending', 'readwrite');
        Object
            .values(pending)
            .flatMap(p => Object.keys(p))
            .forEach(id => tx.store.delete(id));
    }
}
