import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";

class CurrenciesStore {
    static readonly BASE = 'EUR';

    private currencies: string[];
    private rates: { [currency: string]: CurrencyRates };

    constructor(){
        this.fetchRates(CurrenciesStore.BASE);
    }

    async getCurrencies() {
        if (this.currencies === undefined) {
            await this.fetchRates(CurrenciesStore.BASE);
        }
        return this.currencies;
    }

    async getRate(currencyFrom: string, currencyTo: string) {
        if (this.rates === undefined || !(currencyFrom in this.rates)) {
            await this.fetchRates(currencyFrom);
        }
        return this.rates[currencyFrom].rates[currencyTo];
    }

    private async fetchRates(baseCurrency: string) {
        const rates = await currenciesApi.getRates(baseCurrency);
        if (this.currencies === undefined) {
            this.currencies = Object.keys(rates.data.rates);
            this.currencies.push(baseCurrency);
            this.currencies.sort();
        }
    }

    get base(){
        return CurrenciesStore.BASE;
    }
}

export const currenciesStore = new CurrenciesStore();
