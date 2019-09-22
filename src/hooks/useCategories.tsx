import { useState, useEffect } from 'react';
import { Categories } from '../interfaces';
import { useCategoriesStore } from './useCategoriesStore';

export function useCategories() {
    const [categories, setCategories] = useState<Categories>({});
    const store = useCategoriesStore();

    useEffect(() => {
        async function fetchCategories () {
            if (store) {
                setCategories(await store.getCategories());
            }
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchCategories();
        }
        return () => {isSubscribed = false};
    }, [store]);

    return categories;
}
