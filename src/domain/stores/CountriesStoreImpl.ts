import { GeoApi } from '../../services/GeoApi';
import { CountryEntry } from '../../interfaces';
import { CountriesStore } from './interfaces';

interface CachedCountry {
    code: string;
    timestamp?: number;
}

export class CountriesStoreImpl implements CountriesStore {

    private readonly geoApi: GeoApi;
    private currentCountry?: CachedCountry;
    private readonly LAST_COUNTRY_KEY = 'lastCountry';
    readonly countries: CountryEntry[];

    constructor(countries: CountryEntry[]) {
        this.countries = Object.values(countries);
        this.geoApi = new GeoApi();
        this.currentCountry = this.getCachedCurrentCountry();
    }

    private getCachedCurrentCountry (): CachedCountry|undefined {
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
        return undefined;
    }

    private setCurrentCountry (countryCode: string) {
        this.currentCountry = { 
            code: countryCode.toUpperCase(),
            timestamp: Date.now()
        }
        localStorage.setItem(
            this.LAST_COUNTRY_KEY, 
            JSON.stringify(this.currentCountry));
    }

    get currentCountryCode () {
        return this.currentCountry && this.currentCountry.code;
    }

    async getCurrentCountry () {
        if (this.currentCountry && 
            this.currentCountry.code && 
            this.currentCountry.timestamp &&
            Date.now() - this.currentCountry.timestamp < 3600000) {
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
        return this.currentCountry && this.currentCountry.code;
    }
}
