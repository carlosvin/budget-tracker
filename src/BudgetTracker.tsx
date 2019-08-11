import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { IconsStore } from './stores/IconsStore';
import { CurrenciesStore } from './stores/CurrenciesStore';
import { CountriesStore } from './stores/CountriesStore';
import { BudgetsIndexStore } from './stores/BudgetsIndexStore';
import { StorageApi } from './api/storage/StorageApi';
import { CategoriesStore, BudgetsStore } from './stores/interfaces';

class BudgetTracker {

    private _storage?: StorageApi;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;
    private _currenciesStore?: CurrenciesStore;
    private _countriesStore?: CountriesStore;
    private _budgetsIndex?: BudgetsIndexStore;

    async getStorage () {
        if (!this._storage) {
            const storage  = await import('./api/storage/AppStorageManager');
            this._storage = storage.default;
        }
        if (this._storage) {
            return this._storage;
        }
        throw Error('Error Loading Storage');
    }

    async getBudgetsStore () {
        if (!this._budgetsStore) {
            const BudgetsStoreImpl  = (await import('./stores/BudgetsStoreImpl')).default;

            this._budgetsStore = new BudgetsStoreImpl(
                await this.getBudgetsIndex(), 
                this.currenciesStore);
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

    get iconsStore () {
        if (!this._iconsStore) {
            this._iconsStore = new IconsStore();
        }
        return this._iconsStore;
    }

    get currenciesStore () {
        if (!this._currenciesStore) {
            this._currenciesStore = new CurrenciesStore();
        }
        return this._currenciesStore;
    }

    get countriesStore () {
        if (!this._countriesStore) {
            this._countriesStore = new CountriesStore();
        }
        return this._countriesStore;
    }

    render () {
        ReactDOM.render(<App />, document.getElementById('root'));
    }
}

export const btApp = new BudgetTracker();
