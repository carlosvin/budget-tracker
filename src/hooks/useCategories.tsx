import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { Categories } from '../interfaces';

export function useCategories() {
    const [categories, setCategories] = useState<Categories>({});

    useEffect(() => {
        async function fetchCategories () {
            const store = await btApp.getCategoriesStore();
            setCategories(await store.getCategories());
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchCategories();
        }
        return () => {isSubscribed = false};
    }, []);

    return categories;
}
