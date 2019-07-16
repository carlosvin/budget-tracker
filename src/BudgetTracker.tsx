import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppStorageManager } from './api/storage/AppStorageManager';
import { LocalStorage } from './api/storage/LocalStorage';
import { BudgetsStore } from './stores/BudgetsStore';
import { CategoriesStore } from './stores/CategoriesStore';
import { IconsStore } from './stores/IconsStore';
import { CurrenciesStore } from './stores/CurrenciesStore';
import { FirebaseApi } from './api/FirebaseApi';
import { CountriesStore } from './stores/CountriesStore';

class BudgetTracker {

    private _storage?: AppStorageManager;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;
    private _currenciesStore?: CurrenciesStore;
    private _firebaseApi?: FirebaseApi;
    private _countriesStore?: CountriesStore;

    get storage () {
        if (!this._storage) {
            this._storage = new AppStorageManager(new LocalStorage());
        }
        return this._storage;
    }

    get budgetsStore () {
        if (!this._budgetsStore) {
            this._budgetsStore = new BudgetsStore(this.storage, this.currenciesStore);
        }
        return this._budgetsStore;
    }

    get categoriesStore () {
        if (!this._categoriesStore) {
            this._categoriesStore = new CategoriesStore(this.storage);
        }
        return this._categoriesStore;
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

    get firebaseApi () {
        if (!this._firebaseApi) {
            this._firebaseApi = new FirebaseApi();
        }
        return this._firebaseApi;
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
