import { CurrencyRates } from "../api";
import { RemoteApi } from "./RemoteApi";
import { CurrenciesApi } from ".";

class ExchangeRatesApiImpl extends RemoteApi implements CurrenciesApi {

    constructor () {
        super('https://api.exchangeratesapi.io');
    }

    async getRates(baseCurrency: string, expectedCurrencyMatch?: string) {
        const resp = await this.get<CurrencyRates>('latest', {base: baseCurrency});
    
        if (!resp) {
            throw new Error(`There is no response for ${baseCurrency}`);
        }
        if (expectedCurrencyMatch && expectedCurrencyMatch!==baseCurrency && resp && !(expectedCurrencyMatch in resp.rates)) {
            throw new Error(`There is no match for ${baseCurrency} => ${expectedCurrencyMatch}`);
        }
        if (Object.keys(resp.rates).length <= 0) {
            throw new Error(`Empty response for ${baseCurrency}`);
        }
        return resp;
    }
}

class LabstackApiImpl extends RemoteApi implements CurrenciesApi {
    
    private readonly headers: Headers;

    constructor () {
        super('https://currency.labstack.com');
        this.headers = new Headers([['Authorization', `Bearer ${process.env.REACT_APP_CURRENCY_API_KEY}`]]);
    }

    async getRates(baseCurrency: string, expectedCurrencyMatch?: string) {
        const resp = await this.get<CurrencyRates>(
            'api/v1/rates', 
            { base: baseCurrency},
            this.headers);
    
        if (!resp) {
            throw new Error(`There is no response for ${baseCurrency}`);
        }
        if (expectedCurrencyMatch && expectedCurrencyMatch!==baseCurrency && resp && !(expectedCurrencyMatch in resp.rates)) {
            throw new Error(`There is no match for ${baseCurrency} => ${expectedCurrencyMatch}`);
        }
        if (Object.keys(resp.rates).length <= 0) {
            throw new Error(`Empty response for ${baseCurrency}`);
        }
        return resp;
    }
}

/** 
 * Service to fetch currency rates from different APIs, 
 * if fetch call fails it will try with next configured API 
 */
export class CurrenciesApiImpl implements CurrenciesApi {

    private readonly apis: CurrenciesApi[];

    constructor () {
        this.apis = [
            new ExchangeRatesApiImpl(),
            new LabstackApiImpl()
        ];
    }

    async getRates(baseCurrency: string, expectedCurrencyMatch?: string) {
        for (const api of this.apis) {
            try {
                const rates = await api.getRates(baseCurrency, expectedCurrencyMatch);
                return rates;
            } catch (error) {
                console.warn(error);
            }
        }
        throw new Error(`Cannot fetch rates for ${baseCurrency}`);
    }
}
