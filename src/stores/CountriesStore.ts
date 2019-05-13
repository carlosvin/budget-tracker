import * as countries from './countries.json';


export interface CountryEntry {
    Code: string;
    Name: string;
}

class CountriesStore {

    private countries: CountryEntry[];

    constructor() {
        this.countries = Object.values(countries);
        const set = new Set<string>();
        for (const c of this.countries) {
            if (set.has(c.Code)) {
                console.warn('Already exist ', c)
            }
            set.add(c.Code);
        }
    }

    getCountries() {
        return this.countries;
    }
}

export const countriesStore = new CountriesStore();
