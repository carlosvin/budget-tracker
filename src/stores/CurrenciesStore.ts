import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";

class CurrenciesStore {
    static readonly BASE = 'EUR';
    static readonly KEY = 'currencyRates';

    private currencies: string[];
    private rates: { [currency: string]: CurrencyRates };

    constructor() {
        this.loadFromDisk();
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
        if (this.currencies === undefined) {
            try {
                if (this.rates === undefined) {
                    this.rates = {};
                }
                const ratesResponse = await currenciesApi.getRates(baseCurrency);
                this.rates[baseCurrency] = ratesResponse.data;
                this.currencies = Object.keys(this.rates[baseCurrency].rates);
                this.saveToDisk();
            } catch (error) {
                console.warn('Cannot read currencies: ', error);
                this.currencies = [];
            } finally {
                this.currencies.push(baseCurrency);
                this.currencies.sort();
            }
        }
    }

    private async loadFromDisk () {
        const ratesStr = localStorage.getItem(CurrenciesStore.KEY);
        if (ratesStr && ratesStr.length > 0) {
            this.rates = JSON.parse(ratesStr);
            const rate = Object.values(this.rates)[0];
            this.currencies = Object.keys(rate.rates);
            this.currencies.push(rate.base);
            this.currencies.sort();
        }
    }

    private async saveToDisk () {
        localStorage.setItem(CurrenciesStore.KEY, JSON.stringify(this.rates));
    }

    get base(){
        return CurrenciesStore.BASE;
    }
}

export const currenciesStore = new CurrenciesStore();
