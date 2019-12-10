import { useState, useEffect } from 'react';
import { CurrencyRates } from '../api';
import { useCurrenciesStore } from './useCurrenciesStore';
import { CurrenciesStore } from '../domain/stores';

export function useRates(baseCurrency: string) {
    const store = useCurrenciesStore();
    const [rates, setRates] = useState<CurrencyRates|undefined>(
        store && store.getLocalRates(baseCurrency));

    useEffect(() => {
        async function fetch (store: CurrenciesStore) {
            setRates(await store.getRates(baseCurrency));
        }

        store && fetch(store);
    }, [baseCurrency, store]);

    return rates;
}
