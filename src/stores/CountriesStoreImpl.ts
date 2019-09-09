import { GeoApi } from '../api/GeoApi';
import { CountryEntry } from '../interfaces';
import { CountriesStore } from './interfaces';

interface CachedCountry {
    code: string;
    timestamp?: number;
}

export default class CountriesStoreImpl implements CountriesStore {

    private _countries: CountryEntry[];
    private readonly geoApi: GeoApi;
    private readonly DEFAULT_CODE = 'ES';
    private currentCountry: CachedCountry;
    private readonly LAST_COUNTRY_KEY = 'lastCountry';

    constructor() {
        this._countries = [];
        this.geoApi = new GeoApi();
        this.currentCountry = this.getCachedCurrentCountry();
    }

    private getCachedCurrentCountry () {
        const cachedString = localStorage.getItem(this.LAST_COUNTRY_KEY);
        if (cachedString) {
            try {
                const cachedInfo = JSON.parse(cachedString);
                if (cachedInfo.code) {
                    return cachedInfo;
                }     
            } catch (error) {
                console.warn(error);
            }
        }
        return { code: this.DEFAULT_CODE };
    }

    async getCountries() {
        if (this._countries.length === 0) {
            this._countries = await import('./countries.json');;
        }
        return this._countries;
    }

    private setCurrentCountry (countryCode: string) {
        this.currentCountry = { 
            code: countryCode.toUpperCase(),
            timestamp: new Date().getTime()
        }
        localStorage.setItem(
            this.LAST_COUNTRY_KEY, 
            JSON.stringify(this.currentCountry));
    }

    get currentCountryCode () {
        return this.currentCountry.code;
    }

    async getCurrentCountry () {
        if (this.currentCountry.code && 
            this.currentCountry.timestamp &&
            new Date().getTime() - this.currentCountry.timestamp < 3600000) {
            return this.currentCountry.code;
        }
        return this.fetchCurrentCountry();
    }

    private async fetchCurrentCountry () {
        try {
            const countryCode = await this.geoApi.getCurrentCountry();
            if (countryCode) {
                this.setCurrentCountry(countryCode);
                return countryCode.toUpperCase();
            }
        } catch (error) {
            console.warn('Fetching current country error: ', error);
        }
        return this.currentCountry.code || this.DEFAULT_CODE;
    }
}
