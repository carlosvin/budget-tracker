import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BudgetsIndexStore } from './stores/BudgetsIndexStore';
import { StorageApi } from './api/storage/StorageApi';
import { 
    CategoriesStore, BudgetsStore, 
    IconsStore, CurrenciesStore, 
    CountriesStore } from './stores/interfaces';
import { AuthApi } from './api/AuthApi';

class BudgetTracker {

    private _storage?: StorageApi&{initRemote (remotePromise ?: Promise<StorageApi|undefined>): Promise<void>};
    private _firestore?: StorageApi;
    private _localStorage?: StorageApi;
    private _auth?: AuthApi;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;
    private _currenciesStore?: CurrenciesStore;
    private _countriesStore?: CountriesStore;
    private _budgetsIndex?: BudgetsIndexStore;

    async getStorage () {
        if (!this._storage) {
            const storage  = await import('./api/storage/AppStorageManager');
            this._storage = new storage.AppStorageManager(await this.getLocalStorage());
            this._storage.initRemote(this.getFirestore());
        }
        if (this._storage) {
            return this._storage;
        }
        throw Error('Error Loading Storage');
    }

    async initRemoteStorage() {
        return (await this.getStorage()).initRemote(this.getFirestore());
    }

    private async getFirestore () {
        if (!this._firestore) {
            const userId = await (await this.getAuth()).getUserId();
            if (userId) {
                const storage  = await import('./api/storage/FirestoreApi');
                this._firestore = new storage.FirestoreApi(userId);
            }
        }
        return this._firestore;
    }

    private async getLocalStorage () {
        if (!this._localStorage) {
            const storage  = await import('./api/storage/LocalStorage');
            this._localStorage = new storage.LocalStorage();
        }
        return this._localStorage;
    }

    async getAuth () {
        if (!this._auth) {
            const auth  = await import('./api/AuthApiImpl');
            this._auth = new auth.AuthApiImpl();
        }
        return this._auth;
    }

    async getBudgetsStore () {
        if (!this._budgetsStore) {
            const BudgetsStoreImpl  = (await import('./stores/BudgetsStoreImpl')).default;

            this._budgetsStore = new BudgetsStoreImpl(
                await this.getBudgetsIndex(), 
                await this.getCurrenciesStore());
        }
        return this._budgetsStore;
    }

    async getCategoriesStore () {
        if (!this._categoriesStore) {
            const CategoriesStoreImpl  = (await import('./stores/CategoriesStoreImpl')).default;
            this._categoriesStore = new CategoriesStoreImpl(await this.getStorage());
        }
        return this._categoriesStore;
    }

    async getBudgetsIndex () {
        if (!this._budgetsIndex) {
            this._budgetsIndex = new BudgetsIndexStore(await this.getStorage());
        }
        return this._budgetsIndex;
    }

    async getIconsStore () {
        if (!this._iconsStore) {
            const IconsStoreImpl  = (await import('./stores/IconsStoreImpl')).default;
            this._iconsStore = new IconsStoreImpl();
        }
        return this._iconsStore;
    }

    async getCurrenciesStore () {
        if (!this._currenciesStore) {
            const CurrenciesStoreImpl  = (await import('./stores/CurrenciesStoreImpl')).default;
            this._currenciesStore = new CurrenciesStoreImpl();
        }
        return this._currenciesStore;
    }

    async getCountriesStore () {
        if (!this._countriesStore) {
            const CountriesStoreImpl  = (await import('./stores/CountriesStoreImpl')).default;
            this._countriesStore = new CountriesStoreImpl();
        }
        return this._countriesStore;
    }

    render () {
        ReactDOM.render(<App />, document.getElementById('root'));
    }
}

export const btApp = new BudgetTracker();
