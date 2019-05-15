import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";

class CurrenciesStore {
    static readonly KEY = 'currencyRates';

    private _currencies: { [currency: string]: string };
    private _areCurrenciesInitialized: boolean;
    private _rates?: { [currency: string]: CurrencyRates };

    constructor() {
        this._areCurrenciesInitialized = false;
        this._currencies = {};
        this.loadRatesFromDisk();
    }

    async getCurrencies() {
        if (this._areCurrenciesInitialized === false) {
            this.importCurrencies();
        }
        return this._currencies;
    }

    /** 
     * @returns Currency exchange rate
     * @throws Error when there is no rate for that pair of currencies
     */
    async getRate(baseCurrency: string, currencyTo: string) {
        if (this._rates === undefined || !(baseCurrency in this._rates)) {
            await this.fetchRates(baseCurrency);
        }
        if (this._rates && 
            baseCurrency in this._rates && 
            currencyTo in this._rates[baseCurrency].rates) {
            return this._rates[baseCurrency].rates[currencyTo];
        }
        throw Error(`Rate not found ${baseCurrency} => ${currencyTo}`);
    }

    /** 
     * @returns amount in base currency. \ 
     * If baseCurrency == currency it returns the same input @param amount.
     * It returns undefined if cannot get currency rate.
     * @throws Error when there is no rate for that pair of currencies
     */
    async getAmountInBaseCurrency (baseCurrency: string, currency: string, amount: number) {
        if (baseCurrency && currency !== baseCurrency) {
            const rate = await this.getRate(baseCurrency, currency);
            return amount / rate;
        }
        return amount;
    }

    private async importCurrencies () {
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

    private async fetchRates(baseCurrency: string) {
        try {
            if (this._rates === undefined) {
                this._rates = {};
            }
            const rates = await currenciesApi.getRates(
                baseCurrency, 
                Object.keys(await this.getCurrencies()));
            this._rates[baseCurrency] = rates;
            this.saveToDisk();
        } catch (error) {
            console.warn('Cannot read currencies: ', error);
        }
    }

    private loadRatesFromDisk () {
        const ratesStr = localStorage.getItem(CurrenciesStore.KEY);
        if (ratesStr && ratesStr.length > 0) {
            this._rates = JSON.parse(ratesStr);
        }
    }

    private async saveToDisk () {
        localStorage.setItem(CurrenciesStore.KEY, JSON.stringify(this._rates));
    }
}

export const currenciesStore = new CurrenciesStore();
