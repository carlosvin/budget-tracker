import { CurrencyRates } from "../interfaces";
import * as conf from '../../env.json';
import { RemoteApi } from "./RemoteApi";

class CurrenciesApi {

    private primaryApi: RemoteApi;
    private backupApi: RemoteApi;

    private get primary () {
        if (this.primaryApi === undefined) {
            this.primaryApi = new RemoteApi('https://api.exchangeratesapi.io');
        }
        return this.primaryApi;
    }

    private get backup () {
        if (this.backupApi === undefined) {
            this.backupApi = new RemoteApi('https://api.currencystack.io');
        }
        return this.backupApi;
    }

    private async getRatesPrimary (baseCurrency: string) {
        return this.primary.client.get<CurrencyRates>(
            `/latest?base=${baseCurrency}`);
    }

    private async getRatesBackup (baseCurrency: string, targetCurrencies: string[]) {
        return this.primary.client.get<CurrencyRates>(`/currency`, 
        {
            params: {
                base: baseCurrency,
                target: targetCurrencies,
                apikey: conf.currencyApiKey
            }
        });
    }
    
    async getRates(baseCurrency: string, availableCurrencies: string[]) {
        try {
            return this.getRatesPrimary(baseCurrency);
        } catch (error) {
            console.warn('Trying to fetch backup API', error);
            return this.getRatesBackup(baseCurrency, availableCurrencies);
        }
    }
}

export const currenciesApi = new CurrenciesApi();
