import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BudgetsIndexStore } from './stores/BudgetsIndexStore';
import { SubStorageApi, AppStorageApi } from './api/storage/StorageApi';
import {
    CategoriesStore, BudgetsStore,
    IconsStore, CurrenciesStore,
    CountriesStore
} from './stores/interfaces';
import { AuthApi } from './api/AuthApi';

class BudgetTracker {

    private _storage?: AppStorageApi;
    private _firestore?: SubStorageApi;
    private _localStorage?: SubStorageApi;
    private _auth?: AuthApi;
    private _authPromise?: Promise<AuthApi>;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;
    private _currenciesStore?: CurrenciesStore;
    private _countriesStore?: CountriesStore;
    private _budgetsIndex?: BudgetsIndexStore;

    async getStorage() {
        if (!this._storage) {
            const storage = await import('./api/storage/AppStorageManager');
            this._storage = new storage.AppStorageManager(await this.getLocalStorage());
            this._storage.initRemote(this.getFirestore());
        }
        if (this._storage) {
            return this._storage;
        }
        throw Error('Error Loading Storage');
    }

    async cleanupStores() {
        this._firestore = undefined;
        await (await this.getStorage()).initRemote(this.getFirestore());
        this._budgetsIndex = this._budgetsStore = this._categoriesStore = undefined;
    }

    private async getFirestore() {
        if (!this._firestore) {
            try {
                const userId = await (await this.getAuth()).getUserId();
                if (userId) {
                    const storage = await import('./api/storage/FirestoreApi');
                    this._firestore = new storage.FirestoreApi(userId);
                }
            } catch (error) {
                console.warn('Cannot get user ID: ', error);
            }
        }
        return this._firestore;
    }

    private async getLocalStorage() {
        if (!this._localStorage) {
            const storage = await import('./api/storage/LocalStorage');
            this._localStorage = new storage.LocalStorage();
        }
        return this._localStorage;
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
            this._categoriesStore = new CategoriesStoreImpl(await this.getStorage());
        }
        return this._categoriesStore;
    }

    async getBudgetsIndex() {
        if (!this._budgetsIndex) {
            this._budgetsIndex = new BudgetsIndexStore(await this.getStorage());
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
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('sw.js')
                    .then(r => {
                        console.log('service worker registered in scope: ', r.scope);
                    })
                    .catch(e => console.log('SW error: ', e));
            });
        }
    }
}

export const btApp = new BudgetTracker();
