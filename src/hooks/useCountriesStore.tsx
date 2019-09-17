import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { CountriesStore } from '../domain/stores/interfaces';

export function useCountriesStore() {
    const [store, setStore] = useState<CountriesStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getCountriesStore());
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchStore();
        }

        return () => { isSubscribed = false };
        
    }, [store]);

    return store;
}