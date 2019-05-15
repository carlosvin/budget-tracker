import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";

class CurrenciesStore {
    static readonly KEY = 'currencyRates';

    private _currencies: { [currency: string]: string };
    private _areCurrenciesInitialized: boolean;
    private rates?: { [currency: string]: CurrencyRates };

    constructor() {
        this._areCurrenciesInitialized = false;
        this._currencies = {};
        this.loadRatesFromDisk();
    }

    async getCurrencies() {
        if (this._areCurrenciesInitialized === false) {
            const importedCurrencies = (await import('./currency.json')) as 
                {AlphabeticCode: string; WithdrawalDate: string; Currency: string}[];
            Object
                .values(importedCurrencies)
                .filter( c => 
                    c.AlphabeticCode && 
                    (!c.AlphabeticCode.startsWith('X')) && 
                    c.AlphabeticCode.length === 3 && 
                    c.WithdrawalDate === null && 
                    c.Currency && 
                    c.Currency.length > 2)
                .forEach( c => this._currencies[c.AlphabeticCode] = c.Currency);
            this._areCurrenciesInitialized = true;
        }
        return this._currencies;
    }

    async getRate(baseCurrency: string, currencyTo: string) {
        if (this.rates === undefined || !(baseCurrency in this.rates)) {
            await this.fetchRates(baseCurrency);
        }
        if (this.rates) {
            return this.rates[baseCurrency].rates[currencyTo];
        }
    }

    private async fetchRates(baseCurrency: string) {
        try {
            if (this.rates === undefined) {
                this.rates = {};
            }
            const rates = await currenciesApi.getRates(
                baseCurrency, 
                Object.keys(await this.getCurrencies()));
            this.rates[baseCurrency] = rates;
            this.saveToDisk();
        } catch (error) {
            console.warn('Cannot read currencies: ', error);
        }
    }

    private loadRatesFromDisk () {
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
