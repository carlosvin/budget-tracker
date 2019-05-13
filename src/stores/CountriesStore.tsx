import { CountriesApi } from "../api/CountriesApi";
import { dateDiff } from "../utils";
import * as countries from './countries.json';

class CountriesStore {

    private countries: {[code: string]: string};
    private readonly KEY = 'countries';
    private readonly KEY_LAST_SAVED = 'countriesLastSaved';
    private readonly MAX_DAYS = 30;

    constructor() {
        if (this.isDataTooOld) {
            this.fetch();
        } else {
            this.fetchFromLocal();
        }
    }

    private fetchFromLocal(){
        const countriesStr = localStorage.getItem(this.KEY);
        if (countriesStr && countriesStr.length > 5) {
            this.countries = JSON.parse(countriesStr);
        } else {
            this.fetch();
        }
    }

    private async fetch(){
        this.countries = await CountriesApi.getList();
        localStorage.setItem(this.KEY, JSON.stringify(this.countries));
        localStorage.setItem(this.KEY_LAST_SAVED, new Date().getTime().toString());
    }

    private get isDataTooOld () {
        const timestampStr = localStorage.getItem(this.KEY_LAST_SAVED);
        if (timestampStr) {
            const timestamp = parseInt(timestampStr);
            const lastTimeUpdated = dateDiff(timestamp, new Date().getTime());
            return lastTimeUpdated > this.MAX_DAYS;
        }
        return true;
    }

    getCountries() {
        return this.countries;
    }
}

export const countriesStore = new CountriesStore();
