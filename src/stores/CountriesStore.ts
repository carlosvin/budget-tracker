import * as countries from './countries.json';
import { GeoApi } from '../api/GeoApi';

export interface CountryEntry {
    code: string;
    name: string;
}

class CountriesStore {

    private readonly countries: CountryEntry[];
    private readonly geoApi: GeoApi;
    private currentCountryCode?: string;

    constructor() {
        this.countries = Object.values(countries);
        this.geoApi = new GeoApi();
    }

    getCountries() {
        return this.countries;
    }

    async getCurrentCountry() {
        if (this.currentCountryCode === undefined) {
            this.currentCountryCode = await this.geoApi.getCurrentCountry();
            if (this.currentCountryCode) {
                this.currentCountryCode = this.currentCountryCode.toUpperCase();
            }
        }
        return this.currentCountryCode;
    }
}

export const countriesStore = new CountriesStore();
