import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CurrencyInput } from "./CurrencyInput";
import { AmountInput } from "./AmountInput";
import { CurrencyRates } from "../interfaces";
import { CurrenciesStore } from "../stores/CurrenciesStore";
import { round } from "../domain/utils/round";

interface AmountCurrencyInputProps  {
    selectedCurrency: string;
    rates: CurrencyRates;
    amountInBaseCurrency?: number;
    onChange: (amount: number, currency: string, amountBase: number) => void;
    amountInput?: number;
    label?: string;
    disabled?: boolean;
    onError?: (error?: string) => void;
}

export const AmountWithCurrencyInput: React.FC<AmountCurrencyInputProps> = (props) => {

    const [
        amountInBaseCurrency, 
        setAmountInBaseCurrency
    ] = React.useState<number|undefined>(props.amountInBaseCurrency);

    const [currency, setCurrency] = React.useState(props.selectedCurrency);

    const [error, setError] = React.useState<string|undefined>(); 

    function calculateAmountInBaseCurrency(amount: number, currency: string) {
        const rate = props.rates.rates[currency];
        let error = undefined;
        if (rate) {
            const calculatedAmount = currency !== props.rates.base ? CurrenciesStore.convert(amount, rate) : amount;
            setAmountInBaseCurrency(round(calculatedAmount));
            props.onChange(amount, currency, calculatedAmount);
        } else {
            error = 'Cannot get currency exchange rate';
        }
        if (props.onError) {
            setError(error);
            props.onError(error);
        }
    }
    
    // calculate amount in base currency
    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed &&
            props.rates.base &&
            currency && 
            props.amountInput && 
            props.rates.base !== currency) {
            calculateAmountInBaseCurrency(
                props.amountInput, 
                currency);
        }
        return () => {isSubscribed = false};
    }, 
    // eslint-disable-next-line
    [
        props.rates.base, props.amountInput, props.selectedCurrency, currency
    ]);

    const handleAmountChange = (amount: number) => {
        calculateAmountInBaseCurrency(amount, currency);
    }

    const baseAmountString = () => {
        if (props.rates.base !== currency && amountInBaseCurrency) {
            return `${round(amountInBaseCurrency)} ${props.rates.base}`;
        }
        return undefined;
    }

    return (
        <Grid container direction='row' alignItems='baseline'>
            <Grid item>
                <AmountInput
                    amountInput={props.amountInput}
                    label={props.label}
                    onAmountChange={handleAmountChange}
                    helperText={baseAmountString()} 
                    disabled={props.disabled}/>
            </Grid>
            <Grid item >
                <CurrencyInput 
                    selectedCurrency={currency}
                    onCurrencyChange={setCurrency} 
                    disabled={props.disabled}/>
            </Grid>
            { error !== undefined && // TODO show error view
            <Card>
                <CardContent>
                    Error calculating amount in base currency. You need to be connected to Internet to get last currency rates.
                    You can still add the amount in budget base currency.
                </CardContent>
            </Card> }
        </Grid>);
}

export default AmountWithCurrencyInput;
