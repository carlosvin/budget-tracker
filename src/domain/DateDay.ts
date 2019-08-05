import { YMD } from "../interfaces";

export class DateDay implements YMD {
    readonly year: number;
    readonly month: number;
    readonly day: number;

    constructor(date: Date) {
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();
    }
    
    get isToday() {
        return DateDay.isToday(this);
    }

    static isToday(date: YMD) {
        const now = new Date();
        return date.day === now.getDate() && 
            date.month === now.getMonth() && 
            date.year === now.getFullYear();
    }
}