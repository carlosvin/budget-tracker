

class CategoriesStore {

    // TODO sync localStorage with remote DB

    private readonly categories: Set<string>;
    static readonly KEY = 'categories';
    static readonly DEFAULT = ['General', 'Lunch', 'Shopping'];

    constructor() {
        this.categories = new Set<string>(CategoriesStore.DEFAULT);

        const parsedCategories = JSON.parse(
            localStorage.getItem(CategoriesStore.KEY)) as string[];

        try {
            parsedCategories.forEach( c => this.categories.add(c));
        } catch (e) {
            console.warn('Error loading categories, using defaults');
        }
    }

    getCategories() {
        return [...this.categories];
    }

    addCategory(category: string){
        if (this.categories.has(category)) {
            return false;
        }
        this.categories.add(category);
        localStorage.setItem(
            CategoriesStore.KEY, 
            JSON.stringify(Array.from(this.categories)));
            return true;
    }
}

export const categoriesStore = new CategoriesStore();
