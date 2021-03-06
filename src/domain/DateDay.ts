import { YMD } from "../api";

export class DateDay implements YMD {
    private readonly _date: Date;

    constructor(date = new Date()) {
        this._date = new Date(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDate(), 0, 0, 0, 0);
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

    static fromYMD (date: YMD) {
        return new DateDay(new Date(Date.UTC(date.year, date.month, date.day)));
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

    /**
     * @returns current object instance with months added to previous date
     */
    addMonths (months: number) {
        this._date.setMonth(this._date.getMonth() + months);
        return this;
    }

    /**
     * @returns current object instance with years added to previous date
     */
    addYears (years: number) {
        this._date.setFullYear(this._date.getFullYear() + years);
        return this;
    }

    static isToday(date: YMD) {
        const now = new Date();
        return date.day === now.getDate() && 
            date.month === now.getMonth() && 
            date.year === now.getFullYear();
    }

    get shortString () {
        const dt = new Intl.DateTimeFormat(
            undefined, 
            {day: 'numeric', month: 'long', year: 'numeric'});
        return dt.format(this._date);
    }

    equals(date: DateDay) {
        return this._date.getTime() === date._date.getTime();
    }
}