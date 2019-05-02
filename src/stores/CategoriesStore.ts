import { Category } from "../interfaces";

class CategoriesStore {

    // TODO sync localStorage with remote DB

    private readonly categories: Set<Category>;
    static readonly KEY = 'categories';
    static readonly DEFAULT = [
        {name: 'General'}, 
        {name: 'Lunch'}, 
        {name: 'Shopping'}
    ];

    constructor() {
        const parsedCategories = JSON.parse(
            localStorage.getItem(CategoriesStore.KEY)) as Array<Category>;
        
        const mergedCategories = parsedCategories ? 
            [...CategoriesStore.DEFAULT, ...parsedCategories] : 
            CategoriesStore.DEFAULT;
        
        this.categories = new Set<Category>(mergedCategories);
    }

    getCategories() {
        return [...this.categories];
    }

    addCategory(category: Category){
        if (this.categories.add(category)) {
            localStorage.setItem(
                CategoriesStore.KEY, 
                JSON.stringify(this.categories));
        }
    }
}

export const categoriesStore = new CategoriesStore();
