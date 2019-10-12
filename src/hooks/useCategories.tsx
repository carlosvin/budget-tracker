import { useState, useEffect } from 'react';
import { CategoriesMap } from '../api';
import { useCategoriesStore } from './useCategoriesStore';
import { CategoriesStore } from '../domain/stores/interfaces';

export function useCategories() {
    const [categories, setCategories] = useState<CategoriesMap>();
    const store = useCategoriesStore();

    useEffect(() => {
        
        async function fetchCategories (store: CategoriesStore) {
            const cs = await store.getCategories();
            setCategories(cs);
        }

        store && fetchCategories(store);
    }, [store]);

    return categories;
}
