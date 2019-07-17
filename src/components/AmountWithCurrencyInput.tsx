import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CurrencyInput } from "./CurrencyInput";
import { round } from "../utils";
import { AmountInput } from "./AmountInput";
import { CurrencyRates } from "../interfaces";
import { CurrenciesStore } from "../stores/CurrenciesStore";

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
            amountInBaseCurrency === undefined &&
            props.rates.base &&
            props.selectedCurrency && 
            props.amountInput && 
            props.rates.base !== props.selectedCurrency) {
            calculateAmountInBaseCurrency(
                props.amountInput, 
                props.selectedCurrency);
        }
        return () => {isSubscribed = false};
    }, 
    // eslint-disable-next-line
    [
        props.rates.base, props.amountInput, props.selectedCurrency
    ]);

    const handleAmountChange = (amount: number) => {
        calculateAmountInBaseCurrency(amount, props.selectedCurrency);
    }

    const handleCurrencyChange = (selectedCurrency: string) => {
        calculateAmountInBaseCurrency(props.amountInput || 0, selectedCurrency);
    }

    const baseAmountString = () => {
        if (props.rates.base !== props.selectedCurrency && amountInBaseCurrency) {
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
                    selectedCurrency={props.selectedCurrency}
                    onCurrencyChange={handleCurrencyChange} 
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
