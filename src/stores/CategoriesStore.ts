

class CategoriesStore {

    // TODO sync localStorage with remote DB

    private readonly categories: {[key: string]: string};

    constructor() {
        const categoriesStr = localStorage.getItem(CategoriesStore.key);
        if (categoriesStr && categoriesStr.length > 0) {
            this.categories = JSON.parse(categoriesStr) as {[key: string]: string};
        } else {
            this.categories = {
                'General': 'General',    
                'Lunch': 'Lunch',    
                'Shopping': 'Shopping'
            };
        }   
    }

    static get key() {
        return 'categories';
    }

    getCategories() {
        return this.categories;
    }

    setCategory(categoryId: string, category: string) {
        this.categories[categoryId] = category;
        this.save();
    }

    getCategory (categoryId: string) {
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
