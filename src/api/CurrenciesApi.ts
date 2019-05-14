import { CurrencyRates } from "../interfaces";
import * as conf from '../../env.json';
import { RemoteApi } from "./RemoteApi";

class CurrenciesApi {

    private primaryApi: RemoteApi;
    private backupApi: RemoteApi;

    private get backup () {
        if (this.backupApi === undefined) {
            this.backupApi = new RemoteApi('https://api.exchangeratesapi.io');
        }
        return this.backupApi;
    }

    private get primary () {
        if (this.primaryApi === undefined) {
            this.primaryApi = new RemoteApi('https://api.currencystack.io');
        }
        return this.primaryApi;
    }

    private async getRatesBackup (baseCurrency: string) {
        return this.backup.client.get<CurrencyRates>(
            `/latest?base=${baseCurrency}`);
    }

    private async getRatesPrimary (baseCurrency: string, targetCurrencies: string[]) {
        return this.primary.client.get<CurrencyRates>(`/currency`, 
        {
            params: {
                base: baseCurrency,
                target: targetCurrencies.join(','),
                apikey: conf.currencyApiKey
            }
        });
    }
    
    async getRates(baseCurrency: string, availableCurrencies: string[], expectedCurrencyMap?: string) {
        try {
            const resp = this.getRatesPrimary(baseCurrency, availableCurrencies);
            return resp;
        } catch (error) {
            console.warn('Trying to fetch backup API', error);
            return this.getRatesBackup(baseCurrency);
        }
    }
}

export const currenciesApi = new CurrenciesApi();
