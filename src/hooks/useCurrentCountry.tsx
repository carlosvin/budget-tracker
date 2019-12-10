import { useState, useEffect } from 'react';
import { useCountriesStore } from './useCountriesStore';
import { CountriesStore } from '../domain/stores';

export function useCurrentCountry() {
    const store = useCountriesStore();
    const [countryCode, setCountryCode] = useState<string|undefined>(
        store && store.currentCountryCode);

    useEffect(() => {
        async function fetch (store: CountriesStore) {
            setCountryCode(await store.getCurrentCountry());
        }
        store && fetch(store);
    }, [store]);

    return countryCode;
}
