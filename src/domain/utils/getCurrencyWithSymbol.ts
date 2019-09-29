import { ObjectMap } from "../../interfaces";

const formatters: ObjectMap<Intl.NumberFormat> = {};

function getNumberFormatter(currency: string) {
    if (!(currency in formatters)) {
        formatters[currency] = new Intl.NumberFormat(undefined, { 
            style: 'currency', 
            currency,
        });
    }
    return formatters[currency];
}

export function getCurrencyWithSymbol (amount: number, currency: string) {
    return getNumberFormatter(currency).format(amount);
}
