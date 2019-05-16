import { Categories, Category } from "../interfaces";

class CategoriesStore {

    // TODO sync localStorage with remote DB

    private readonly categories: Categories;

    constructor() {
        const categoriesStr = localStorage.getItem(CategoriesStore.key);
        if (categoriesStr && categoriesStr.length > 0) {
            this.categories = JSON.parse(categoriesStr) as Categories;
        } else {
            this.categories = {};
        }
    }

    static get key() {
        return 'categories';
    }

    getCategories() {
        return this.categories;
    }

    setCategory(category: Category) {
        this.categories[category.id] = {
            icon: category.icon,
            name: category.name,
            id: category.id
        };
        this.save();
    }

    getCategory(categoryId: string): Category|undefined { 
        return this.categories[categoryId];
    }

    delete(categoryId: string) {
        if (categoryId in this.categories) {
            delete this.categories[categoryId];
            this.save();
            return true;
        }
        return false;
    }

    private save() {
        localStorage.setItem(
            CategoriesStore.key, 
            JSON.stringify(this.categories));
    }
}

export const categoriesStore = new CategoriesStore();
