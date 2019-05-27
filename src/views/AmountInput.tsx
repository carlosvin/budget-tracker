import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { CurrencyInput, CurrencyInputProps } from "./CurrencyInput";
import { TextInput } from "./TextInput";
import { currenciesStore } from "../stores/CurrenciesStore";
import { round } from "../utils";


interface AmountInputProps {
    label?: string;
    amount?: number;
    onAmountChange?: (amount: number) => void;
    helperText?: string;
}

export const AmountInput: React.FC<AmountInputProps> = (props) => {
    
    const [amount, setAmount] = React.useState(props.amount || '');

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
        if (props.onAmountChange) {
            props.onAmountChange(parseFloat(event.target.value));
        }
    }
    return (
        <TextInput 
            autoFocus
            required
            type='number'
            label={props.label || 'Amount'}
            value={amount}
            inputProps={{ step: '.01', 'aria-required': true }}
            onChange={handleAmountChange}
            helperText={props.helperText}
        />
    );           
}

interface AmountCurrencyInputProps extends CurrencyInputProps, AmountInputProps {
    baseCurrency?: string;
    amountInBaseCurrency?: number;
    onAmountInBaseCurrencyChange?: (amount: number) => void;
}

export const AmountWithCurrencyInput: React.FC<AmountCurrencyInputProps> = (props) => {
    const [amountInBaseCurrency, setAmountInBaseCurrency] = React.useState<number|undefined>(props.amountInBaseCurrency);

    const [currency, setCurrency] = React.useState<string|undefined>(props.selectedCurrency);
    const [amount, setAmount] = React.useState<number|undefined>(props.amount);

    const {onAmountInBaseCurrencyChange, baseCurrency} = props;

    // TODO review if it is needed
    React.useEffect(() => {
        const calculateAmountInBaseCurrency = async (
            amount: number, 
            baseCurrency: string, 
            currency: string) => {
            const calculatedAmount = await currenciesStore.getAmountInBaseCurrency(
                baseCurrency, 
                currency,
                amount);
            setAmountInBaseCurrency(round(calculatedAmount));
    
            if (onAmountInBaseCurrencyChange) {
                onAmountInBaseCurrencyChange(calculatedAmount);
            }
        }

        if (baseCurrency &&
            currency && 
            amount && 
            baseCurrency !== currency) {
            calculateAmountInBaseCurrency(
                amount, 
                baseCurrency, 
                currency);
        }
    }, [baseCurrency, currency, amount, onAmountInBaseCurrencyChange]);

    const handleAmountChange = (amount: number) => {
        if (props.onAmountChange) {
            props.onAmountChange(amount);
        }
        setAmount(amount);
    }

    const handleCurrencyChange = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
        if (props.onCurrencyChange) {
            props.onCurrencyChange(selectedCurrency);
        }
    }

    const baseAmount = () => {
        if (baseCurrency !== currency && amountInBaseCurrency) {
            return `${round(amountInBaseCurrency)} ${baseCurrency}`;
        }
        return undefined;
    }

    return (
        <Grid container direction='row' alignItems='baseline'>
            <Grid item>
                <AmountInput {...props} onAmountChange={handleAmountChange} helperText={baseAmount()}/>
            </Grid>
            <Grid item >
                <CurrencyInput {...props} onCurrencyChange={handleCurrencyChange}/>
            </Grid>
        </Grid>);
}

export default AmountWithCurrencyInput;