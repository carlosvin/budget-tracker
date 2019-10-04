import { useState, useEffect } from 'react';
import { useBudgetsStore } from './useBudgetsStore';
import { BudgetsStore } from '../domain/stores/interfaces';
import { Budget } from '../api';

export function useBudgetsIndex() {
    const store = useBudgetsStore();
    const [index, setIndex] = useState<Budget[]>();

    useEffect(() => {
        async function fetchIndex (store: BudgetsStore) {
            setIndex(Object.values(await store.getBudgetsIndex()));
        }

        let isSubscribed = true;

        if (isSubscribed) {
            if (store) {
                fetchIndex(store);
            } else {
                setIndex(undefined);
            }
        }
        return () => {isSubscribed = false};
        
    }, [store]);

    return index;
}