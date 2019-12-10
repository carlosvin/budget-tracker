import { useState, useEffect } from 'react';
import { useBudgetsStore } from './useBudgetsStore';
import { BudgetsStore } from '../domain/stores';
import { Budget } from '../api';

export function useBudgetsIndex() {
    const store = useBudgetsStore();
    const [index, setIndex] = useState<Budget[]>();

    useEffect(() => {
        async function fetchIndex (store: BudgetsStore) {
            setIndex(Object.values(await store.getBudgetsIndex()));
        }
        store ? fetchIndex(store) : setIndex(undefined);
    }, [store]);

    return index;
}