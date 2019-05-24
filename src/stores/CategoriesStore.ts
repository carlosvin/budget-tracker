import { Categories, Category } from "../interfaces";

class CategoriesStore {

    // TODO sync localStorage with remote DB

    private static KEY = 'categories';
    private categories: Categories;

    constructor() {
        this.categories = {};
        const categoriesStr = localStorage.getItem(CategoriesStore.KEY);
        if (categoriesStr && categoriesStr.length > 0) {
            const categories = JSON.parse(categoriesStr) as Categories;
            Object
                .entries(categories)
                .filter((e) => e[1].name && e[1].icon)
                .forEach(([k, v]) => this.categories[k] = v);

        }
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

    setCategories(categories: Categories) {
        this.categories = categories;
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
            CategoriesStore.KEY, 
            JSON.stringify(this.categories));
    }
}

export const categoriesStore = new CategoriesStore();
