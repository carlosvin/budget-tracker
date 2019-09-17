import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { CurrencyRates } from '../interfaces';

export function useRates(baseCurrency: string) {
    const [rates, setRates] = useState<CurrencyRates>();

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
    }, [baseCurrency]);

    return rates;
}
