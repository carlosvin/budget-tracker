import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BudgetsIndexStore } from './domain/stores/BudgetsIndexStore';
import { SubStorageApi, AppStorageApi } from './services/storage/StorageApi';
import { 
    CategoriesStore, BudgetsStore, 
    IconsStore, CurrenciesStore, 
    CountriesStore } from './domain/stores/interfaces';
import { AuthApi } from './services/AuthApi';

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

    constructor () {
        // background initialization for auth
        this.initBgAuth();
    }

    private async initBgAuth () {
        console.log('Fetching auth info...');
        console.log('Auth: ', await (await this.getAuth()).getUserId());
    }

    private async getStorage () {
        if (!this._storage) {
            const storage  = await import('./services/storage/AppStorageManager');
            this._storage = new storage.AppStorageManager(await this.getLocalStorage());
        }
        if (this._storage) {
            return this._storage;
        }
        throw Error('Error Loading Storage');
    }

    private async initFirestore (uid?: string) {
        if (uid) {
            if (!this._firestore) {
                try {
                    if (uid) {
                        const storage  = await import('./services/storage/FirestoreApi');
                        this._firestore = new storage.FirestoreApi(uid);
                    }    
                } catch (error) {
                    console.warn('Cannot get user ID: ', error);
                }
            }
        } else {
            this._firestore = undefined;
        }
        return this._firestore;

    }

    private async getLocalStorage () {
        if (!this._localStorage) {
            const storage  = await import('./services/storage/IndexedDb');
            this._localStorage = new storage.IndexedDb();
        }
        return this._localStorage;
    }

    private onAuth = async (uid?: string) => {
        const storage  = await this.getStorage();
        storage.setRemote(await this.initFirestore(uid));
    }

    async getAuth () {
        if (this._auth) {
            return this._auth;
        }
        if (this._authPromise) {
            return this._authPromise;
        }
        this._authPromise = this.getAuthPromise();
        this._auth = await this._authPromise;
        this._auth.subscribe(this.onAuth);
        this._authPromise = undefined;
        return this._auth;
    }

    private async getAuthPromise () {
        const auth  = await import('./services/AuthApiImpl');
        return new auth.AuthApiImpl();
    }

    async getBudgetsStore () {
        if (!this._budgetsStore) {
            const BudgetsStoreImpl  = (await import('./domain/stores/BudgetsStoreImpl')).default;
            this._budgetsStore = new BudgetsStoreImpl(await this.getBudgetsIndex());
        }
        return this._budgetsStore;
    }

    async getCategoriesStore () {
        if (!this._categoriesStore) {
            const CategoriesStoreImpl  = (await import('./domain/stores/CategoriesStoreImpl')).default;
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
            const IconsStoreImpl  = (await import('./domain/stores/IconsStoreImpl')).default;
            this._iconsStore = new IconsStoreImpl();
        }
        return this._iconsStore;
    }

    async getCurrenciesStore () {
        if (!this._currenciesStore) {
            const [currencies, CurrenciesStoreImpl] = await Promise.all([
                import('./constants/currency.json'),
                import('./domain/stores/CurrenciesStoreImpl')
            ]);
            this._currenciesStore = new CurrenciesStoreImpl.default(currencies);
        }
        return this._currenciesStore;
    }

    async getCountriesStore () {
        if (!this._countriesStore) {
            const CountriesStoreImpl  = (await import('./domain/stores/CountriesStoreImpl')).default;
            this._countriesStore = new CountriesStoreImpl(await import('./constants/countries.json'));
        }
        return this._countriesStore;
    }

    render () {
        ReactDOM.render(<App />, document.getElementById('root'));
    }
}

export const btApp = new BudgetTracker();
