import { useState, useEffect } from 'react';
import { Category } from '../interfaces';
import { useCategoriesStore } from './useCategoriesStore';

export function useCategory(identifier: string) {
    const [category, setCategory] = useState<Category>();
    const store  = useCategoriesStore();

    useEffect(() => {
        async function fetchCategory () {
            if (store) {
                setCategory(await store.getCategory(identifier));
            }
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchCategory();
        }
        
        return () => {isSubscribed = false};

    }, [identifier, store]);

    return category;
}
