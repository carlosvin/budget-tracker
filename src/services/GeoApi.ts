import { RemoteApi } from "./RemoteApi";

export class GeoApi {

    private readonly api = new RemoteApi('https://nominatim.openstreetmap.org');

    async getCurrentLocation () {
        if (navigator.geolocation) {
            return new Promise<Position>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        }
        return Promise.reject('Geolocation is not supported');
    }

    async getCountry(lat: number, lon: number){
        const params = {
            format: 'json',
            lon: lon,
            lat: lat,
        };
        return this.api.client.get<{address: {country_code: string}}>(
            '/reverse.php',
            { params: params }
        );
    }

    async getCurrentCountry () {
        const pos = await this.getCurrentLocation();
        const resp = await this.getCountry(pos.coords.latitude, pos.coords.longitude);
        return resp.data.address.country_code;
    }
}
