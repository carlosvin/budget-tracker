import { YMD } from "./interfaces";

/**
 * Get difference between 2 dates in days
 * @param from - Starting period timestamp
 * @param to - Ending period timestamp
 */
export function dateDiff(from: number, to: number) {
    return Math.round((to - from)/(1000*60*60*24));
}

export function timestampToDate(timestamp: number) {
    return new Date(timestamp).toDateString();
}

/** 
 * @returns Date (no time) as string type in ISO format
 */
export function getDateString (date = new Date()) {
    return date.toISOString().slice(0,10);
}

export function round(quantity: number, digits = 2){
    const coefficient = Math.pow(10, digits);
    return Math.round(quantity * coefficient) / coefficient
}

export function uuid() {
    // TODO generate uuid following spec
    return new Date().getTime().toString();
}

export function desc (a: number, b: number) { 
    return b - a; 
}

// TODO group all date functions in a class or module
export function monthToString (date: Date) {
    const dt = new Intl.DateTimeFormat(undefined, {month: 'long'});
    return dt.format(date);
}

export function convertToYMD(date: Date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
    };
}

export function isToday(date: Date) {
    return isTodayYMD(convertToYMD(date));
}

export function isTodayYMD(date: YMD) {
    const now = new Date();
    return date.day === now.getDate() && 
        date.month === now.getMonth() && 
        date.year === now.getFullYear();
}