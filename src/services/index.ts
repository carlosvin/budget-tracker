import { CurrencyRates } from '../api';

export * from './storage';

export interface LocalizationApi {
    readonly lang: string;

    get(key: string): string;
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