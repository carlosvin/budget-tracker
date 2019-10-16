import { useState, useEffect } from 'react';
import { useCurrenciesStore } from './useCurrenciesStore';
import { CurrenciesStore } from '../domain/stores/interfaces';

export function useRate(baseCurrency: string, toCurrency: string) {
    const [rate, setRate] = useState<number>();
    const store = useCurrenciesStore();

    useEffect(() => {
        async function fetch (store: CurrenciesStore) {
            const rate = await store.getRate(baseCurrency, toCurrency);
            setRate(rate);
        }

        function setLocalRate (store: CurrenciesStore) {
            const localRates = store.getLocalRates(baseCurrency);
            if (localRates && toCurrency in localRates) {
                setRate(localRates.rates[toCurrency]);
            }
        }

        let isSubscribed = true;
        if (isSubscribed && store) {
            setLocalRate(store);
            fetch(store);
        }
        return () => {isSubscribed = false};
    }, [baseCurrency, toCurrency, store]);

    return rate;
}
