import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";
import * as currenciesConfig from './currency.json';

class CurrenciesStore {
    static readonly KEY = 'currencyRates';

    private currencies: { [currency: string]: string };
    private rates: { [currency: string]: CurrencyRates };

    constructor() {
        this.currencies = {};
        Object
            .values(currenciesConfig)
            .filter( c => 
                c.AlphabeticCode && 
                (!c.AlphabeticCode.startsWith('X')) && 
                c.AlphabeticCode.length === 3 && 
                c.WithdrawalDate === null && 
                c.Currency && 
                c.Currency.length > 2)
            .forEach( c => this.currencies[c.AlphabeticCode] = c.Currency);
        this.loadRatesFromDisk();
    }

    getCurrencies() {
        return this.currencies;
    }

    async getRate(baseCurrency: string, currencyTo: string) {
        if (this.rates === undefined || !(baseCurrency in this.rates)) {
            await this.fetchRates(baseCurrency);
        }
        return this.rates[baseCurrency].rates[currencyTo];
    }

    private async fetchRates(baseCurrency: string) {
        try {
            if (this.rates === undefined) {
                this.rates = {};
            }
            const ratesResponse = await currenciesApi.getRates(baseCurrency, Object.keys(this.currencies));
            this.rates[baseCurrency] = ratesResponse.data;
            this.saveToDisk();
        } catch (error) {
            console.warn('Cannot read currencies: ', error);
        }
    }

    private async loadRatesFromDisk () {
        const ratesStr = localStorage.getItem(CurrenciesStore.KEY);
        if (ratesStr && ratesStr.length > 0) {
            this.rates = JSON.parse(ratesStr);
        }
    }

    private async saveToDisk () {
        localStorage.setItem(CurrenciesStore.KEY, JSON.stringify(this.rates));
    }

    /** 
     * @returns amount in base currency. \ 
     * If baseCurrency == currency it returns the same input @param amount.
     * It returns undefined if cannot get currency rate.
     */
    async getAmountInBaseCurrency (baseCurrency: string, currency: string, amount: number) {
        if (baseCurrency && currency !== baseCurrency) {
            const rate = await this.getRate(baseCurrency, currency);
            return rate ? amount / rate : undefined;
        }
        return amount;
    }
}

export const currenciesStore = new CurrenciesStore();
