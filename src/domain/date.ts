
const DAY_MS = 1000*60*60*24;

/**
 * Get difference between 2 dates in days, including from and to dates.
 * @param from - Starting period timestamp
 * @param to - Ending period timestamp
 */
export function dateDiff(from: number, to: number) {
    return Math.floor((to - from)/DAY_MS) + 1;
}

/** 
 * @returns Date (without time) as string type in ISO format
 */
export function getISODateString (date = new Date()) {
    return date.toISOString().slice(0,10);
}
