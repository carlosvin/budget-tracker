import { CurrencyRates } from "../interfaces";
import { currenciesApi } from "../api/CurrenciesApi";
import { dateDiff } from "../utils";

class CurrenciesStore {
    static readonly KEY = 'currencyRates';
    static readonly KEY_TS = 'currencyTimestamps';
    // TODO make this configurable
    static readonly MAX_DAYS = 2;
    
    private _currencies: { [currency: string]: string };
    private _areCurrenciesInitialized: boolean;
    private _rates: { [currency: string]: CurrencyRates };
    private _timestamps: { [currency: string]: number };
    private _countriesCurrencyMap?: {[country: string]: string};

    constructor() {
        this._areCurrenciesInitialized = false;
        this._currencies = {};
        this._timestamps = this.getTimestampsFromDisk();
        this._rates = this.getRatesFromDisk();
    }

    async getCurrencies() {
        if (this._areCurrenciesInitialized === false) {
            await this.importCurrencies();
        }
        return this._currencies;
    }

    /** 
     * @returns Currency exchange rate
     * @throws Error when there is no rate for that pair of currencies
     */
    async getRate(baseCurrency: string, currencyTo: string): Promise<number> {
        let promise = undefined;
        if (this.shouldFetch(baseCurrency)) {
            promise = this.fetchRates(baseCurrency, currencyTo);
        }
        if (promise && !this.isPresent(baseCurrency, currencyTo)) {
            try {
                await promise;
            } catch (error) {
                console.warn(error);
            }
        }
        return this._rates[baseCurrency].rates[currencyTo];
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

    private isUpdated(baseCurrency: string) {
        return baseCurrency in this._timestamps && 
            dateDiff(
                this._timestamps[baseCurrency], 
                new Date().getTime()
            ) <= CurrenciesStore.MAX_DAYS;
    }

    private async importCurrencies () {
        const importedCurrencies = await import('./currency.json');
        importedCurrencies
            .default
            .filter( c => 
                c.AlphabeticCode && 
                (!c.AlphabeticCode.startsWith('X')) && 
                c.AlphabeticCode.length === 3 && 
                c.WithdrawalDate === null && 
                c.Currency && 
                c.Currency.length > 2)
            .forEach( c => this._currencies[c.AlphabeticCode || 'null'] = c.Currency);
        this._areCurrenciesInitialized = true;
    }

    /** 
     * @throws Error when it returns invalid response after fetching currencies  
     */
    private async fetchRates(baseCurrency: string, expectedCurrencyMatch?: string) {
        if (this._rates === undefined) {
            this._rates = {};
        }
        const currencies = await this.getCurrencies();
        const rates = await currenciesApi.getRates(
            baseCurrency, 
            Object.keys(currencies),
            expectedCurrencyMatch);
        if (Object.keys(rates.rates).length > 0) {
            this._rates[baseCurrency] = rates;
            this._timestamps[baseCurrency] = new Date().getTime()
            this.saveTimestampsToDisk();
            this.saveRatesToDisk();
        }
    }

    private shouldFetch (baseCurrency: string) {
        return this._rates === undefined || 
            !(baseCurrency in this._rates) || 
            !this.isUpdated(baseCurrency);
    }

    private isPresent(baseCurrency: string, toCurrency: string){
        return this._rates && 
            baseCurrency in this._rates && 
            toCurrency in this._rates[baseCurrency].rates;
    }

    private getRatesFromDisk () {
        const ratesStr = localStorage.getItem(CurrenciesStore.KEY);
        if (ratesStr && ratesStr.length > 0) {
            return JSON.parse(ratesStr);
        }
        return {};
    }

    private getTimestampsFromDisk () {
        const timestampsStr = localStorage.getItem(CurrenciesStore.KEY_TS);
        if (timestampsStr && timestampsStr.length > 0) {
            return JSON.parse(timestampsStr);
        }
        return {};
    }

    private saveRatesToDisk () {
        localStorage.setItem(CurrenciesStore.KEY, JSON.stringify(this._rates));
    }

    private saveTimestampsToDisk () {
        localStorage.setItem(CurrenciesStore.KEY_TS, JSON.stringify(this._timestamps));
    }

    async getFromCountry (countryCode: string) {
        if (!this._countriesCurrencyMap) {
            const cs = await import('./countryCurrency.json');
            this._countriesCurrencyMap = cs.default;    
        }
        return this._countriesCurrencyMap[countryCode];
    }
}

export const currenciesStore = new CurrenciesStore();
