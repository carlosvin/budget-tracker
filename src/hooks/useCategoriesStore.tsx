import { useState, useEffect } from 'react';
import { CategoriesStore } from '../domain/stores/interfaces';
import { useAppContext } from '../contexts/AppContext';

export function useCategoriesStore () {
    const btApp = useAppContext();
    const [store, setStore] = useState<CategoriesStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getCategoriesStore());
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchStore();
        }

        return () => { isSubscribed = false };
        
    }, [btApp, store]);

    return store;
}
