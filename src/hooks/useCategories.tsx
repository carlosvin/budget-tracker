import { useState, useEffect } from 'react';
import { CategoriesMap } from '../api';
import { useCategoriesStore } from './useCategoriesStore';
import { CategoriesStore } from '../domain/stores';

export function useCategories() {
    const [categories, setCategories] = useState<CategoriesMap>();
    const store = useCategoriesStore();

    useEffect(() => {
        
        async function fetchCategories (store: CategoriesStore) {
            setCategories(await store.getCategories());
        }

        store && fetchCategories(store);
    }, [store]);

    return categories;
}
