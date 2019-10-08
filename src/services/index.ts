export interface LocalizationApi {
    readonly lang: string;

    get(key: string): string;
}
