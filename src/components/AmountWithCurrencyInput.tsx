import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CurrencyInput } from "./CurrencyInput";
import { AmountInput } from "./AmountInput";
import { CurrencyRates } from "../interfaces";
import { round } from "../domain/utils/round";
import applyRate from "../domain/utils/applyRate";
import { getCurrencyWithSymbol } from "../domain/utils/getCurrencyWithSymbol";

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

    const [error, setError] = React.useState<string|undefined>(); 
    
    const {onChange, onError} = props;
    const {rates, base} = props.rates;

    function handleChange(amount: number, currency: string) {
        if (base && props.selectedCurrency && amount) {
            if (base === props.selectedCurrency) {
                onChange(amount, currency, amount);
            } else {
                try {
                    onChange(amount, currency, calculateAmountInBaseCurrency(amount, currency));
                    setError(undefined);
                } catch (error) {
                    setError(error);
                }
            }
        } else {
            onChange(amount, currency, amount);
        }
    }

    function calculateAmountInBaseCurrency(inputAmount: number, inputCurrency: string) {
        const rate = rates[inputCurrency];
        if (rate) {
            return applyRate(inputAmount, rate);
        } else {
            throw new Error('Cannot get currency exchange rate');
        }
    }

    React.useEffect(() => (onError && onError(error)), [error, onError]);

    const baseAmountString = () => {
        if (base !== props.selectedCurrency && props.amountInBaseCurrency) {
            return getCurrencyWithSymbol(round(props.amountInBaseCurrency), base);
        }
        return undefined;
    }

    function handleCurrencyChange (currency: string) {
        if (props.amountInput !== undefined) {
            handleChange(props.amountInput, currency);
        }
    }

    function handleAmountChange (amount: number) {
        if (props.selectedCurrency) {
            handleChange(amount, props.selectedCurrency);
        }
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
