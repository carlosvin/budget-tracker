
/** 
 * Round a number using a specific number of digits
 * @param digits Number of digits in decimal part
 * @param value Number to be rounded
 */
export function round(value: number, digits = 2){
    const coefficient = Math.pow(10, digits);
    return Math.round(value * coefficient) / coefficient
}
