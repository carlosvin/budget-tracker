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
        this._countries = [];
        this.geoApi = new GeoApi();
    }

    async getCountries() {
        if (this._countries.length === 0) {
            const cs = await import('./countries.json');

            this._countries = cs.default;
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
