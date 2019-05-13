import * as countries from './countries.json';


export interface CountryEntry {
    code: string;
    name: string;
}

class CountriesStore {

    private countries: CountryEntry[];

    constructor() {
        this.countries = Object.values(countries);
    }

    getCountries() {
        return this.countries;
    }
}

export const countriesStore = new CountriesStore();
