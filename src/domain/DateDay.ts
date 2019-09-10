import { YMD } from "../interfaces";

export class DateDay implements YMD {
    private readonly _date: Date;

    constructor(date = new Date()) {
        this._date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    clone() {
        return new DateDay(this._date);
    }

    get year () {
        return this._date.getFullYear();
    }

    get month () {
        return this._date.getMonth();
    }

    get day () {
        return this._date.getDate();
    }

    static fromTimeMs (timestampMs: number) {
        return new DateDay(new Date(timestampMs));
    }

    get timeMs () {
        return this._date.getTime();
    }
    
    get isToday() {
        return DateDay.isToday(this);
    }

    /**
     * @returns current object instance with days added to previous date
     */
    addDays (days: number) {
        this._date.setDate(this._date.getDate() + days);
        return this;
    }

    static isToday(date: YMD) {
        const now = new Date();
        return date.day === now.getDate() && 
            date.month === now.getMonth() && 
            date.year === now.getFullYear();
    }

    get shortString () {
        const dt = new Intl.DateTimeFormat(undefined, {day: 'numeric', month: 'long', year: 'numeric'});
        return dt.format(this._date);
    }
}