import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { Category } from '../interfaces';

export function useCategory(identifier: string) {
    const [category, setCategory] = useState<Category>();

    useEffect(() => {
        async function fetchCategory () {
            const store = await btApp.getCategoriesStore();
            setCategory(await store.getCategory(identifier));
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchCategory();
        }
        
        return () => {isSubscribed = false};

    }, [identifier]);

    return category;
}