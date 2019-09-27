import { useState, useEffect } from 'react';
import { CurrenciesStore } from '../domain/stores/interfaces';
import { useAppContext } from '../contexts/AppContext';

export function useCurrenciesStore() {
    const btApp = useAppContext();
    const [store, setStore] = useState<CurrenciesStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getCurrenciesStore());
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchStore();
        }

        return () => { isSubscribed = false };
        
    }, [btApp]);

    return store;
}