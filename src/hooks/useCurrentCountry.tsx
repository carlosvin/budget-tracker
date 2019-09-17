import { useState, useEffect } from 'react';
import { useCountriesStore } from './useCountriesStore';
import { CountriesStore } from '../domain/stores/interfaces';

export function useCurrentCountry() {
    const store = useCountriesStore();
    const [countryCode, setCountryCode] = useState<string>();

    useEffect(() => {
        async function fetch (store: CountriesStore) {
            setCountryCode(await store.getCurrentCountry());
        }

        let isSubscribed = true;
        if (isSubscribed && store) {
            setCountryCode(store.currentCountryCode);
            fetch(store);
        }
        return () => {isSubscribed = false};
    }, [store]);

    return countryCode;
}
