
export function getCurrencyWithSymbol (amount: number, currency: string) {
    return new Intl.NumberFormat(undefined, { 
        style: 'currency', 
        currency,
    }).format(amount);
}
