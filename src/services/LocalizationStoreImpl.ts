import { ObjectMap } from '../api';
import { LocalizationApi } from '.';

const DEFAULT_LANG = 'en';

const LANG_STRINGS: ObjectMap<Promise<any>> = {
    [DEFAULT_LANG]: import('../constants/strings/en.json'),
    'es': import('../constants/strings/es.json'),
};

export class LocalizationImpl implements LocalizationApi {

    readonly lang: string;
    private strings: ObjectMap<string>;

    constructor(lang: string) {
        lang = lang.slice(0, 2);

        this.lang = lang in LANG_STRINGS ? lang : DEFAULT_LANG;
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
