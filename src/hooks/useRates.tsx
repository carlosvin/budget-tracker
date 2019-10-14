import { useState, useEffect } from 'react';
import { CurrencyRates } from '../api';
import { useCurrenciesStore } from './useCurrenciesStore';
import { CurrenciesStore } from '../domain/stores/interfaces';

export function useRates(baseCurrency: string) {
    const [rates, setRates] = useState<CurrencyRates>();
    const store = useCurrenciesStore();

    useEffect(() => {
        async function fetch (store: CurrenciesStore) {
            const r = await store.getRates(baseCurrency);
            setRates(r);
        }

        let isSubscribed = true;
        if (isSubscribed && store) {
            setRates(store.getLocalRates(baseCurrency));
            fetch(store);
        }
        return () => {isSubscribed = false};
    }, [baseCurrency, store]);

    return rates;
}
