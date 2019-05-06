

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

    add(category: string){
        if (this.categories.has(category)) {
            return false;
        }
        this.categories.add(category);
        this.save();
        return true;
    }

    delete(category: string) {
        if (this.categories.delete(category)) {
            this.save();
            return true;
        }
        return false;
    }

    private save() {
        localStorage.setItem(
            CategoriesStore.KEY, 
            JSON.stringify(Array.from(this.categories)));
    }
}

export const categoriesStore = new CategoriesStore();
