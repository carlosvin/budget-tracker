import { CurrencyRates } from "../interfaces";
import axios, { AxiosInstance } from 'axios';

class CurrenciesApi {

    readonly baseUrl: string;
    readonly rest: AxiosInstance;

    constructor(baseUrl = 'https://api.exchangeratesapi.io/') {
        this.rest = axios.create({
            baseURL: baseUrl
        });
        this.baseUrl = baseUrl;
    }

    async getRates(baseCurrency: string) {
        return this.rest.get<CurrencyRates>(
            `/latest?base=${baseCurrency}`);
    }
}

export const currenciesApi = new CurrenciesApi();
