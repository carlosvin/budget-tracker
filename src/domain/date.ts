
/**
 * Get difference between 2 dates in days
 * @param from - Starting period timestamp
 * @param to - Ending period timestamp
 */
export function dateDiff(from: number, to: number) {
    return Math.round((to - from)/(1000*60*60*24));
}

/** 
 * @returns Date (without time) as string type in ISO format
 */
export function getISODateString (date = new Date()) {
    return date.toISOString().slice(0,10);
}

/** 
 * @returns month name from Date input
 */
export function monthToString (month: number) {
    const dt = new Intl.DateTimeFormat(undefined, {month: 'long'});
    return dt.format(new Date(2000, month, 1));
}
