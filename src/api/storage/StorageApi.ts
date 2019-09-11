import { ExpensesMap, BudgetsMap, Budget, Expense, Categories, Category, ExportDataSet } from "../../interfaces";

export interface SyncItem {
    identifier: string;
    type: 'categories'|'budgets'|'expenses'
}

export interface WriteStorageApi {
    saveBudget(budget: Budget, timestamp?: number): Promise<void>;
    deleteBudget(budgetId: string, timestamp?: number): Promise<void>;
    
    saveExpenses(budgetId: string, expenses: Expense[], timestamp?: number): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string, timestamp?: number): Promise<void>;

    saveCategory(category: Category, timestamp?: number): Promise<void>;
    deleteCategory(identifier: string, timestamp?: number): Promise<void>;

    import(data: ExportDataSet): Promise<void>;
}


export interface ReadStorageApi {
    getBudget(identifier: string): Promise<Budget|undefined>;
    getBudgets(): Promise<BudgetsMap>;

    getExpense(budgetId: string, expenseId: string): Promise<Expense|undefined>;
    getExpenses(budgetId: string): Promise<ExpensesMap>;
    
    getCategory(identifier: string): Promise<Category|undefined>;
    getCategories(): Promise<Categories>;

    export(): Promise<ExportDataSet>;
}

export interface StorageApi extends WriteStorageApi, ReadStorageApi {}

export interface AppStorageApi extends StorageApi {
    initRemote (remotePromise?: Promise<StorageApi|undefined>): Promise<StorageApi|undefined>;
}

export interface SubStorageApi extends StorageApi {
    getLastTimeSaved(): Promise<number>;
    setLastTimeSaved(timestamp: number): Promise<void>;
}

export interface LocalStorageApi extends SubStorageApi {
    getSyncPending(): Promise<SyncItem[]>;
    deleteSyncPending(identifier: string): Promise<void>;
}
