import { 
    ExpensesMap, 
    BudgetsMap, 
    Budget, 
    Expense, 
    CategoriesMap, 
    Category, 
    EntityNames, 
    Exporter,
    Importer
} from "../../api";

export interface SyncItem {
    identifier: string;
    type: EntityNames;
}

export interface DbItem {
    deleted: number;
    timestamp: number;
}

export interface WriteStorageApi {
    setBudget(budget: Budget, timestamp?: number): Promise<void>;
    deleteBudget(budgetId: string, timestamp?: number): Promise<void>;
    
    setExpenses(expenses: Expense[], timestamp?: number): Promise<void>;
    deleteExpense(expenseId: string, timestamp?: number): Promise<void>;

    setCategories(category: Category[], timestamp?: number): Promise<void>;
    deleteCategory(identifier: string, timestamp?: number): Promise<void>;

}

export interface ReadStorageApi {
    getBudget(identifier: string): Promise<Budget|undefined>;
    getBudgets(): Promise<BudgetsMap>;

    getExpense(expenseId: string): Promise<Expense|undefined>;
    getExpenses(budgetId: string): Promise<ExpensesMap>;
    
    getCategory(identifier: string): Promise<Category|undefined>;
    getCategories(): Promise<CategoriesMap>;

}

export interface StorageApi extends WriteStorageApi, ReadStorageApi {}

export interface SubStorageApi extends StorageApi, Importer, Exporter {
    getLastTimeSaved(): Promise<number>;
    setLastTimeSaved(timestamp: number): Promise<void>;
}

export interface StorageObserver {
    onStorageDataChanged(): void;
}

export interface AppStorageApi extends StorageApi {
    setRemote(remote?: SubStorageApi): Promise<void>;

    addObserver(observer: StorageObserver): void;
    deleteObserver(observer: StorageObserver): void;
}
