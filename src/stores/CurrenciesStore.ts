import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";

class CurrenciesStore {
    private currencies: string[];
    private rates: { [currency: string]: CurrencyRates };

    async getCurrencies() {
        if (this.currencies === undefined) {
            await this.fetchRates('EUR');
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
        }
    }
}

export const currenciesStore = new CurrenciesStore();
