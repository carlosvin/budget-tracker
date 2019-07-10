import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppStorageManager } from './api/storage/AppStorageManager';
import { LocalStorage } from './api/storage/LocalStorage';
import { BudgetsStore } from './stores/BudgetsStore';
import { CategoriesStore } from './stores/CategoriesStore';
import { IconsStore } from './stores/IconsStore';

class AppBudgetTrackerApp {

    private _storage?: AppStorageManager;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;

    get storage () {
        if (!this._storage) {
            this._storage = new AppStorageManager(new LocalStorage());
        }
        return this._storage;
    }

    get budgetsStore () {
        if (!this._budgetsStore) {
            this._budgetsStore = new BudgetsStore(this.storage);
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
}

export const btApp = new AppBudgetTrackerApp();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
