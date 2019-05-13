import axios, { AxiosInstance } from 'axios';

export class RemoteApi {
    readonly baseUrl: string;
    readonly client: AxiosInstance;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl
        });
        this.baseUrl = baseUrl;
    }
}