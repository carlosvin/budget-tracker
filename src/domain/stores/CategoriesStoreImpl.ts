import { Categories, Category } from "../../interfaces";
import { StorageApi } from "../../services/storage/StorageApi";
import { CategoriesStore } from './interfaces';

export class CategoriesStoreImpl implements CategoriesStore {

    private _categories?: Categories;
    private readonly _storage: StorageApi;
    private _loading?: Promise<Categories>;

    constructor(storage: StorageApi) {
        this._storage = storage;
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
