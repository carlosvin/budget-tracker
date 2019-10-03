import { CurrencyRates, ObjectMap } from "../../interfaces";
import { currenciesApi } from "../../services/CurrenciesApi";
import { CurrenciesStore } from "./interfaces";
import applyRate from "../utils/applyRate";

export class CurrenciesStoreImpl implements CurrenciesStore {
    static readonly KEY = 'currencyRates';
    static readonly KEY_TS = 'currencyTimestamps';
    static readonly KEY_LAST = 'lastCurrency';
    static readonly UPDATE_RATES_MS = 12 * 3600 * 1000;
    
    readonly currencies: ObjectMap<string>;
    private _rates: { [currency: string]: CurrencyRates };
    private _timestamps: { [currency: string]: number };
    private _countriesCurrencyMap?: {[country: string]: string};
    private _lastCurrencyUsed?: string;

    constructor(importedCurrencies: ObjectMap<string>) {
        this.currencies = importedCurrencies;
            
        this._timestamps = this.getTimestampsFromDisk();
        this._rates = this.getRatesFromDisk();
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
     * @returns Currency exchange rates for a base currency
     */
    async getRates(baseCurrency: string): Promise<CurrencyRates> {
        let promise = undefined;
        if (this.shouldFetch(baseCurrency)) {
            promise = this.fetchRates(baseCurrency);
        }
        if (promise) {
            try {
                await promise;
            } catch (error) {
                console.warn(error);
            }
        }
        return this._rates[baseCurrency];
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
            return applyRate(amount, rate);
        }
        return amount;
    }

    private isUpdated(baseCurrency: string) {
        return baseCurrency in this._timestamps 
            && this.isTimestampUpdated(this._timestamps[baseCurrency]);
    }

    private isTimestampUpdated(timestamp: number) {
        return Date.now() - timestamp <= CurrenciesStoreImpl.UPDATE_RATES_MS;
    }

    /** 
     * @throws Error when it returns invalid response after fetching currencies  
     */
    private async fetchRates(baseCurrency: string, expectedCurrencyMatch?: string) {
        if (this._rates === undefined) {
            this._rates = {};
        }
        const rates = await currenciesApi.getRates(
            baseCurrency, 
            Object.keys(this.currencies),
            expectedCurrencyMatch);
        if (Object.keys(rates.rates).length > 0) {
            this._rates[baseCurrency] = rates;
            this._timestamps[baseCurrency] = Date.now()
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
        const ratesStr = localStorage.getItem(CurrenciesStoreImpl.KEY);
        if (ratesStr && ratesStr.length > 0) {
            return JSON.parse(ratesStr);
        }
        return {};
    }

    private getTimestampsFromDisk () {
        const timestampsStr = localStorage.getItem(CurrenciesStoreImpl.KEY_TS);
        if (timestampsStr && timestampsStr.length > 0) {
            return JSON.parse(timestampsStr);
        }
        return {};
    }

    private saveRatesToDisk () {
        localStorage.setItem(CurrenciesStoreImpl.KEY, JSON.stringify(this._rates));
    }

    private saveTimestampsToDisk () {
        localStorage.setItem(CurrenciesStoreImpl.KEY_TS, JSON.stringify(this._timestamps));
    }

    async getFromCountry (countryCode: string) {
        if (!this._countriesCurrencyMap) {
            const cs = await import('../../constants/countryCurrency.json');
            this._countriesCurrencyMap = cs.default;    
        }
        const currency = this._countriesCurrencyMap[countryCode];
        if (currency) {
            this.setLastCurrencyUsed(currency);
        }
        return currency;
    }

    get lastCurrencyUsed () {
        if (!this._lastCurrencyUsed) {
            this._lastCurrencyUsed =  localStorage.getItem(CurrenciesStoreImpl.KEY_LAST) || undefined;
        }
        return this._lastCurrencyUsed;
    }

    private setLastCurrencyUsed (currency: string) {
        if (this._lastCurrencyUsed !== currency) {
            this._lastCurrencyUsed = currency;
            localStorage.setItem(CurrenciesStoreImpl.KEY_LAST, currency);
        }
    }
}
