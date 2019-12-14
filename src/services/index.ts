import { CurrencyRates } from '../api';

export * from './storage';

export interface LocalizationApi {
    readonly lang: string;

    get(key: string): string;

    /** 
     * @returns month name from Date input
     */
    monthToString (month: number): string;

    /** 
     * @returns month and year name from Date input
     */
    monthYearToString (year: number, month: number): string;
}

export interface AuthApi {

    startAuth(): Promise<string|undefined>;
    logout(): Promise<void>;

    getUserId(): Promise<string|undefined>;
    subscribe(onAuth: (uid?: string) => void): () => void;
}

export interface CurrenciesApi {
    getRates(baseCurrency: string, expectedCurrencyMatch?: string): Promise<CurrencyRates>;
}