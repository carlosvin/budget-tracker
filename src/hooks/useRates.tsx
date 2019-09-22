import { useState, useEffect } from 'react';
import { CurrencyRates } from '../interfaces';
import { useAppContext } from '../contexts/AppContext';

export function useRates(baseCurrency: string) {
    const [rates, setRates] = useState<CurrencyRates>();
    const btApp = useAppContext();

    useEffect(() => {
        async function fetch () {
            const store = await btApp.getCurrenciesStore();
            setRates(await store.getRates(baseCurrency));
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetch();
        }
        return () => {isSubscribed = false};
    }, [baseCurrency, btApp]);

    return rates;
}
