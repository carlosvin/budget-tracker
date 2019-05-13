import axios, { AxiosInstance } from 'axios';

export class RemoteApi {
    readonly baseUrl: string;
    readonly rest: AxiosInstance;

    constructor(baseUrl: string) {
        this.rest = axios.create({
            baseURL: baseUrl
        });
        this.baseUrl = baseUrl;
    }

    get client(){
        return this.rest;
    }

}