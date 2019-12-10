import { useState, useEffect } from 'react';
import { CategoriesStore } from '../domain/stores';
import { useAppContext } from '../contexts/AppContext';

export function useCategoriesStore () {
    const btApp = useAppContext();
    const [store, setStore] = useState<CategoriesStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getCategoriesStore());
        }
        fetchStore();
    }, [btApp, store]);

    return store;
}
