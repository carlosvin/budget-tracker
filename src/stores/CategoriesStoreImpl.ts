import { Categories, Category } from "../interfaces";
import { StorageApi } from "../api/storage/StorageApi";
import { CategoriesStore } from './interfaces';

export default class CategoriesStoreImpl implements CategoriesStore {

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

    async setCategory(category: Category) {
        const categories = await this.getCategories();
        categories[category.identifier] = {
            icon: category.icon,
            name: category.name,
            identifier: category.identifier
        };
        return this._storage.saveCategory(categories[category.identifier]);
    }

    async setCategories(categories: Categories) {
        this._categories = categories;
        return this._storage.saveCategories(categories);
    }

    async getCategory(categoryId: string) { 
        const categories = await this.getCategories();
        return categories[categoryId];
    }

    async delete(categoryId: string) {
        const categories = await this.getCategories();
        if (categoryId in categories) {
            delete categories[categoryId];
            this._storage.saveCategories(categories);
            return true;
        }
        return false;
    }
}
