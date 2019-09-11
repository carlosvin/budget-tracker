import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BudgetsIndexStore } from './stores/BudgetsIndexStore';
import { StorageApi } from './api/storage/StorageApi';
import {
    CategoriesStore, BudgetsStore,
    IconsStore, CurrenciesStore,
    CountriesStore
} from './stores/interfaces';
import { AuthApi } from './api/AuthApi';
import { IndexedDb } from './api/storage/IndexedDb';
import { AppStorageManager } from './api/storage/AppStorageManager';

class BudgetTracker {

    readonly storage: StorageApi;
    private _auth?: AuthApi;
    private _authPromise?: Promise<AuthApi>;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;
    private _currenciesStore?: CurrenciesStore;
    private _countriesStore?: CountriesStore;
    private _budgetsIndex?: BudgetsIndexStore;

    // TODO remove Web Worker example: readonly firestoreWorker: Worker;

    constructor () {
        // this.firestoreWorker = new Worker('./firestore.worker.ts');
        this.storage = new AppStorageManager(new IndexedDb());
    }

    refreshStores() {
        this._budgetsIndex = this._budgetsStore = this._categoriesStore = undefined;
    }

    async getAuth() {
        if (this._auth) {
            return this._auth;
        }
        if (this._authPromise) {
            return this._authPromise;
        }
        this._authPromise = this.getAuthPromise();
        this._auth = await this._authPromise;
        this._authPromise = undefined;
        return this._auth;
    }

    private async getAuthPromise() {
        const auth = await import('./api/AuthApiImpl');
        return new auth.AuthApiImpl();
    }

    async getBudgetsStore() {
        if (!this._budgetsStore) {
            const BudgetsStoreImpl = (await import('./stores/BudgetsStoreImpl')).default;

            this._budgetsStore = new BudgetsStoreImpl(
                await this.getBudgetsIndex(),
                await this.getCurrenciesStore());
        }
        return this._budgetsStore;
    }

    async getCategoriesStore() {
        if (!this._categoriesStore) {
            const CategoriesStoreImpl = (await import('./stores/CategoriesStoreImpl')).default;
            this._categoriesStore = new CategoriesStoreImpl(this.storage);
        }
        return this._categoriesStore;
    }

    async getBudgetsIndex() {
        if (!this._budgetsIndex) {
            this._budgetsIndex = new BudgetsIndexStore(this.storage);
        }
        return this._budgetsIndex;
    }

    async getIconsStore() {
        if (!this._iconsStore) {
            const IconsStoreImpl = (await import('./stores/IconsStoreImpl')).default;
            this._iconsStore = new IconsStoreImpl();
        }
        return this._iconsStore;
    }

    async getCurrenciesStore() {
        if (!this._currenciesStore) {
            const CurrenciesStoreImpl = (await import('./stores/CurrenciesStoreImpl')).default;
            this._currenciesStore = new CurrenciesStoreImpl();
        }
        return this._currenciesStore;
    }

    async getCountriesStore() {
        if (!this._countriesStore) {
            const CountriesStoreImpl = (await import('./stores/CountriesStoreImpl')).default;
            this._countriesStore = new CountriesStoreImpl();
        }
        return this._countriesStore;
    }

    render() {
        ReactDOM.render(<App />, document.getElementById('root'));
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                await navigator.serviceWorker.register('sw.js');
            });
        }
    }
}

export const btApp = new BudgetTracker();
