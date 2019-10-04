import { ObjectMap } from "../api";

export class RemoteApi {
    readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getUrl (path: string, queryParams: ObjectMap<string>) {
        const url = new URL(`${this.baseUrl}/${path}`);
        Object
            .keys(queryParams)
            .forEach(
                key => url.searchParams.append(key, queryParams[key]));
        return url.toString();

    }

    private async fetch<T>(url: string, request?: RequestInit): Promise<T> {
        const response = await fetch(url, request);
        if (response.ok) {
            return response.json();
        }
        throw new Error(`Error fetching ${url} > ${response.status}`);
    }

    async get<T>(path: string, params: ObjectMap<string>): Promise<T> {
        const url = this.getUrl(path, params)
        return this.fetch(url, {method: 'GET' });
    }
}