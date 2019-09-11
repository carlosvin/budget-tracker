import { LocalStorageApi, SubStorageApi, SyncItem } from "./StorageApi";
import { ExportDataSet } from "../../interfaces";

export class LocalToRemoteSync {

    private readonly localStorage: LocalStorageApi;
    private readonly remoteStorage: SubStorageApi;

    constructor(localStorage: LocalStorageApi, remoteStorage: SubStorageApi) {
        this.localStorage = localStorage;
        this.remoteStorage = remoteStorage;
    }

    async sync() {
        // TODO consider a more functional approach where we map the input to 
        // list of budgets, expenses and categories. Once we have the items in different collections
        // we call remote.saveExpenses(expenses) instead of save items one by one (remote.saveBudget(budget))
        // so we can take advantage of optimizations inside storages implementations
        // Other option is to convert pending items to ExportDataSet and import it directly to remote storage
        const pendingList = await this.localStorage.getSyncPending();
        for (const entity of pendingList) {
            const {identifier, type} = entity;
            try {
                if (type === 'budgets') {
                    await this.toRemoteBudget(identifier);
                } else if (type === 'expenses') {
                    await this.toRemoteExpense(identifier);
                } else if (type === 'categories') {
                    await this.toRemoteCategory(identifier);
                } else {
                    console.error('Invalid entity type ' + type);
                }
            } catch (error) {
                console.error(error);
            } finally {
                await this.localStorage.deleteSyncPending(identifier);
            }
        }
    }

    private async toRemoteBudget(identifier: string) {
        const budget = await this.localStorage.getBudget(identifier);
        if (budget) {
            await this.remoteStorage.saveBudget(budget);
        } else {
            throw new Error('Budget is not present in local storage: ' + identifier);
        }
    }

    private async toRemoteCategory(identifier: string) {
        const category = await this.localStorage.getCategory(identifier);
        if (category) {
            await this.remoteStorage.saveCategory(category);
        } else {
            throw new Error('Category is not present in local storage: ' + identifier);
        }
    }

    private async toRemoteExpense(identifier: string) {
        const expense = await this.localStorage.getExpense('not-required', identifier);
        if (expense) {
            await this.remoteStorage.saveExpenses('not-required', [expense]);
        } else {
            throw new Error('Budget is not present in local storage: ' + identifier);
        }
    }
}


export class RemoteToLocalSync {

    private readonly localStorage: LocalStorageApi;
    private readonly remoteStorage: SubStorageApi;

    constructor(localStorage: LocalStorageApi, remoteStorage: SubStorageApi) {
        this.localStorage = localStorage;
        this.remoteStorage = remoteStorage;
    }

    async sync() {
       // TODO figure out how to get lo
        const pendingList = await this.remoteStorage.getSyncPending();
    }

}