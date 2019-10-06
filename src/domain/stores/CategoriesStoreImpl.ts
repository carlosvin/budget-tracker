import { CategoriesMap, Category } from "../../api";
import { AppStorageApi, StorageObserver } from "../../services/storage/StorageApi";
import { CategoriesStore } from './interfaces';

export class CategoriesStoreImpl implements CategoriesStore, StorageObserver {

    private _categories?: CategoriesMap;
    private readonly _storage: AppStorageApi;
    private _loading?: Promise<CategoriesMap>;

    constructor(storage: AppStorageApi) {
        this._storage = storage;
        this._storage.addObserver(this);
    }

    onStorageDataChanged(){
        this._categories = undefined;
    }

    async getCategories() {
        if (!this._categories) {
            if (!this._loading) {
                this._loading = this._storage.getCategories();
            }
            this._categories = await this._loading;
        }
        return this._categories;
    }

    async setCategories(categories: Category[]){
        const cs = await this.getCategories();
        categories.forEach(c => cs[c.identifier] = c)
        return this._storage.setCategories(categories);
    }

    async getCategory(categoryId: string) { 
        const categories = await this.getCategories();
        return categories[categoryId];
    }

    async deleteCategory(categoryId: string) {
        const categories = await this.getCategories();
        if (categoryId in categories) {
            this._storage.deleteCategory(categoryId);
            delete categories[categoryId];
            return true;
        }
        return false;
    }
}
