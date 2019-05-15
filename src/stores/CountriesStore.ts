import { GeoApi } from '../api/GeoApi';

export interface CountryEntry {
    code: string;
    name: string;
}

class CountriesStore {

    private _countries: CountryEntry[];
    private readonly geoApi: GeoApi;
    private currentCountryCode?: string;

    constructor() {
        this.geoApi = new GeoApi();
    }

    async getCountries() {
        if (this._countries === undefined) {
            this._countries = Object.values(await import('./countries.json'));
        }
        return this._countries;
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
