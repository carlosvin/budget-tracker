import { CurrencyRates } from "../interfaces";
import axios, { AxiosInstance } from 'axios';
import * as conf from '../../env.json';

class CurrenciesApi {

    readonly rest: AxiosInstance;
    
    constructor() {
        this.rest = axios.create({
            baseURL: 'http://data.fixer.io'
        });
    }

    async getRates(baseCurrency: string) {
        return this.rest.get<CurrencyRates>(
            '/api/latest', 
            { params: { 
                base: baseCurrency,
                'access_key': conf.currencyApiKey
            }});
    }
}

export const currenciesApi = new CurrenciesApi();
