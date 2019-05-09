

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
        return Object.values(this.categories);
    }

    add(category: string){
        if (category in this.categories) {
            return false;
        }
        this.categories[category] = undefined;
        this.save();
        return true;
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
