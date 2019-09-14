import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { BudgetsStore } from '../domain/stores/interfaces';

export function useBudgetsStore() {
    const [store, setStore] = useState<BudgetsStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getBudgetsStore());
        }

        let isSubscribed = true;

        if (isSubscribed) {
            fetchStore();
        }

        return () => {isSubscribed = false};
        
    }, []);

    return store;
}