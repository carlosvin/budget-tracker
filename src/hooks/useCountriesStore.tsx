import { useState, useEffect } from 'react';
import { CountriesStore } from '../domain/stores';
import { useAppContext } from '../contexts/AppContext';

export function useCountriesStore() {
    const btApp = useAppContext();
    const [store, setStore] = useState<CountriesStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getCountriesStore());
        }
        fetchStore();
    }, [btApp, store]);

    return store;
}