import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { CurrencyInput } from "./CurrencyInput";
import { currenciesStore } from "../stores/CurrenciesStore";
import { round } from "../utils";
import { AmountInput } from "./AmountInput";
import { Card, CardContent } from "@material-ui/core";

interface AmountCurrencyInputProps  {
    baseCurrency: string;
    selectedCurrency: string;
    amountInBaseCurrency?: number;
    onChange: (amount: number, currency: string, amountBase?: number) => void;
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
    
    // calculate amount in base currency
    React.useEffect(() => {
        let isSubscribed = true;
        async function calculateAmountInBaseCurrency(
            amount: number, 
            baseCurrency: string, 
            currency: string) {
                try {
                    const calculatedAmount = await currenciesStore.getAmountInBaseCurrency(
                        baseCurrency, 
                        currency,
                        amount);
                    setAmountInBaseCurrency(round(calculatedAmount));
                    props.onChange(amount, currency, calculatedAmount);
                } catch (error) {
                    console.warn(error);
                }
        }
        if (isSubscribed &&
            amountInBaseCurrency === undefined &&
            props.baseCurrency &&
            props.selectedCurrency && 
            props.amountInput && 
            props.baseCurrency !== props.selectedCurrency) {
            calculateAmountInBaseCurrency(
                props.amountInput, 
                props.baseCurrency, 
                props.selectedCurrency);
        }
        if (props.onError) {
            props.onError(error() ? 'Cannot get currency exchange rate' : undefined);
        }
        return () => {isSubscribed = false};
    }, 
    // eslint-disable-next-line
    [
        props.baseCurrency, props.amountInput, props.selectedCurrency
    ]);

    const handleAmountChange = (amount: number) => {
        setAmountInBaseCurrency(undefined);
        const b = props.baseCurrency !== props.selectedCurrency ? amountInBaseCurrency : amount;
        props.onChange(amount, props.selectedCurrency, b);
    }

    const handleCurrencyChange = (selectedCurrency: string) => {
        setAmountInBaseCurrency(undefined);
        const b = props.baseCurrency !== selectedCurrency ? amountInBaseCurrency : props.amountInput;
        props.onChange(props.amountInput || 0, selectedCurrency, b);
    }

    const baseAmountString = () => {
        if (props.baseCurrency !== props.selectedCurrency && amountInBaseCurrency) {
            return `${round(amountInBaseCurrency)} ${props.baseCurrency}`;
        }
        return undefined;
    }

    function error () {
        return props.selectedCurrency !== props.baseCurrency && 
            amountInBaseCurrency === undefined;
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
            { error() && // TODO show error view
            <Card>
                <CardContent>
                    Error calculating amount in base currency. You need to be connected to Internet to get last currency rates.
                    You can still add the amount in budget base currency.
                </CardContent>
            </Card> }
        </Grid>);
}

export default AmountWithCurrencyInput;
