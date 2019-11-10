import { SubStorageApi, AppStorageApi } from './services/storage/StorageApi';
import { 
    CategoriesStore, BudgetsStore, 
    IconsStore, CurrenciesStore, 
    CountriesStore} from './domain/stores/interfaces';
import { AuthApi } from './services/AuthApi';
import { AppStorageManager } from './services/storage/AppStorageManager';
import { IndexedDb } from './services/storage/IndexedDb';
import { BudgetTracker } from './api';
import { LocalizationApi } from './services';
import { LocalizationImpl } from './services/LocalizationStoreImpl';

export class BudgetTrackerImpl implements BudgetTracker {

    readonly storage: AppStorageApi;
    readonly localization: LocalizationApi;
    private _firestore?: SubStorageApi;
    private _auth?: AuthApi;
    private _authPromise?: Promise<AuthApi>;
    private _budgetsStore?: BudgetsStore;
    private _categoriesStore?: CategoriesStore;
    private _iconsStore?: IconsStore;
    private _currenciesStore?: CurrenciesStore;
    private _countriesStore?: CountriesStore;

    constructor () {
        // background initialization for auth
        this.initBgAuth();
        this.storage = new AppStorageManager(new IndexedDb());
        this.localization = new LocalizationImpl(navigator.language);
    }

    private async initBgAuth () {
        console.debug('Fetching auth info...');
        console.debug('Auth: ', await (await this.getAuth()).getUserId());
    }

    private async initFirestore (uid?: string) {
        if (uid) {
            if (!this._firestore) {
                try {
                    const storage  = await import('./services/storage/FirestoreApi');
                    this._firestore = new storage.FirestoreApi(uid, true);
                } catch (error) {
                    console.warn('Cannot get user ID: ', error);
                }
            }
        } else {
            this._firestore = undefined;
        }
        return this._firestore;
    }

    private onAuth = async (uid?: string) => {
        this.storage.setRemote(await this.initFirestore(uid));
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

    async getBudgetsStore (): Promise<BudgetsStore> {
        if (!this._budgetsStore) {
            const bs = await import('./domain/stores/BudgetsStoreImpl');
            this._budgetsStore = new bs.BudgetsStoreImpl(this);
        }
        return this._budgetsStore;
    }

    async getCategoriesStore () {
        if (!this._categoriesStore) {
            const imported = await import('./domain/stores/CategoriesStoreImpl');
            this._categoriesStore = new imported.CategoriesStoreImpl(this.storage);
        }
        return this._categoriesStore;
    }

    async getIconsStore () {
        if (!this._iconsStore) {
            const imported  = await import('./domain/stores/IconsStoreImpl');
            this._iconsStore = new imported.IconsStoreImpl();
        }
        return this._iconsStore;
    }

    async getCurrenciesStore (): Promise<CurrenciesStore> {
        if (!this._currenciesStore) {
            const currencies = await import('./constants/currencies.json');
            const store = await import('./domain/stores/CurrenciesStoreImpl');
            this._currenciesStore = new store.CurrenciesStoreImpl(currencies.default);
        }
        return this._currenciesStore;
    }

    async getCountriesStore () {
        if (!this._countriesStore) {
            const imported  = await import('./domain/stores/CountriesStoreImpl');
            this._countriesStore = new imported.CountriesStoreImpl(
                await import('./constants/countries.json'));
        }
        return this._countriesStore;
    }
}
