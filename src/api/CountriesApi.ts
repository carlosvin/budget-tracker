
import { RemoteApi } from './RemoteApi';

interface ResponseCountry {
    Code: string;
    Name: string;
}

export class CountriesApi {

    private static api = new RemoteApi('http://country.io');
    private static path = 'names.json';

    static async getList() {
        const response = await this.api.client.get<ResponseCountry[]>(CountriesApi.path);
        const countries: {[code: string]: string} = {};
        response.data.forEach(c => countries[c.Code] = c.Name);
        return countries;
    }
}

