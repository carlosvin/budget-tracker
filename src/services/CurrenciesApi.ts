import { CurrencyRates } from "../interfaces";
import { RemoteApi } from "./RemoteApi";

class CurrenciesApi {

    private readonly primary: RemoteApi;
    private _backup?: RemoteApi;

    constructor () {
        this.primary = new RemoteApi('https://api.currencystack.io');
    }

    // most likely it won't be instantiated, that's why it is lazy loaded
    private get backup () {
        if (this._backup === undefined) {
            this._backup = new RemoteApi('https://api.exchangeratesapi.io');
        }
        return this._backup;
    }

    private async getRatesBackup (baseCurrency: string) {
        return this.backup.get<CurrencyRates>('latest', {base: baseCurrency});
    }

    private async getRatesPrimary (baseCurrency: string, targetCurrencies: string[]) {
        return this.primary.get<CurrencyRates>('currency', 
            {
                base: baseCurrency,
                target: targetCurrencies.join(','),
                apikey: process.env.REACT_APP_CURRENCY_API_KEY || ''
            });
    }
    
    async getRates(baseCurrency: string, availableCurrencies: string[], expectedCurrencyMatch?: string) {
        let resp;
        try {
            resp = await this.getRatesPrimary(baseCurrency, availableCurrencies);
        } catch (error) {
            console.warn('Trying to fetch backup API: ', error);
            resp = await this.getRatesBackup(baseCurrency);
        } finally {
            if (!resp) {
                throw new Error(`There is no response for ${baseCurrency}`);
            }
            if (expectedCurrencyMatch && resp && !(expectedCurrencyMatch in resp.rates)) {
                throw new Error(`There is no match for ${baseCurrency} => ${expectedCurrencyMatch}`);
            }
            if (Object.keys(resp.rates).length <= 0) {
                throw new Error(`Empty response for ${baseCurrency}`);
            }
            return resp;
        }
    }
}

export const currenciesApi = new CurrenciesApi();
