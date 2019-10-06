import { ObjectMap } from '../api';
import { LocalizationApi } from '.';

const LANG_STRINGS: ObjectMap<Promise<any>> = {
    'es': import('../constants/strings/es.json'),
    'en': import('../constants/strings/en.json'),
};

export class LocalizationImpl implements LocalizationApi {

    readonly lang: string;
    private strings: ObjectMap<string>;

    constructor(lang: string) {
        this.lang = lang.slice(0, 2);
        this.strings = {};
        this.initStrings();
    }

    private async initStrings() {
        const loaded = (await LANG_STRINGS[this.lang]).default;
        Object.entries(loaded).forEach(([k, v]) => this.strings[k] = v as string);
    }

    get(key: string) {
        return this.strings[key] || key;
    }
}
