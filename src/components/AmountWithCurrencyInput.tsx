import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CurrencyInput } from "./CurrencyInput";
import { AmountInput } from "./AmountInput";
import { CurrencyRates } from "../interfaces";
import { round } from "../domain/utils/round";
import applyRate from "../domain/utils/applyRate";

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

    const [currency, setCurrency] = React.useState<string>(props.selectedCurrency);
    const [amount, setAmount] = React.useState<number|undefined>(props.amountInput);

    const [error, setError] = React.useState<string|undefined>(); 
    
    const {onChange, onError} = props;
    const {rates, base} = props.rates;

    // calculate amount in base currency
    React.useEffect(() => {
        function calculateAmountInBaseCurrency(inputAmount: number) {
            const rate = rates[currency];
            if (rate) {
                const calculatedAmount = applyRate(inputAmount, rate);
                setAmountInBaseCurrency(round(calculatedAmount));
                setError(undefined);
            } else {
                setError('Cannot get currency exchange rate');
            }
        }

        let isSubscribed = true;
        if (isSubscribed &&
            base &&
            currency && amount) {
            if (base === currency) {
                setAmountInBaseCurrency(round(amount));
            } else {
                calculateAmountInBaseCurrency(amount);    
            }
        }
        return () => {isSubscribed = false};
    }, [base, rates, amount, currency]);

    React.useEffect(() => (onError && onError(error)), [error, onError]);

    React.useEffect(() => {
        if (amount && amountInBaseCurrency) {
            onChange(amount, currency, amountInBaseCurrency);
        }
    // eslint-disable-next-line
    }, [amount, currency, amountInBaseCurrency]);

    const baseAmountString = () => {
        if (base !== currency && amountInBaseCurrency) {
            return `${round(amountInBaseCurrency)} ${base}`;
        }
        return undefined;
    }
    
    return (
        <Grid container direction='row' alignItems='baseline'>
            <Grid item>
                <AmountInput
                    amountInput={amount}
                    label={props.label}
                    onAmountChange={setAmount}
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
