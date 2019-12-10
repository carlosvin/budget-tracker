import { CurrencyRates } from "../api";
import { RemoteApi } from "./RemoteApi";
import { CurrenciesApi } from ".";

export class CurrenciesApiImpl implements CurrenciesApi {

    private readonly primary: RemoteApi;
    private _backup?: RemoteApi;

    constructor () {
        this.primary = new RemoteApi('https://api.exchangeratesapi.io');
    }

    async getRates(baseCurrency: string, expectedCurrencyMatch?: string) {
        const resp = await this.primary.get<CurrencyRates>('latest', {base: baseCurrency});
    
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
