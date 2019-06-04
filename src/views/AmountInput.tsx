import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { CurrencyInput } from "./CurrencyInput";
import { TextInput } from "./TextInput";
import { currenciesStore } from "../stores/CurrenciesStore";
import { round } from "../utils";

interface AmountInputProps {
    label?: string;
    amountInput?: number;
    onAmountChange: (amount: number) => void;
    helperText?: string;
}

export const AmountInput: React.FC<AmountInputProps> = (props) => {

    const [amount, setAmount] = React.useState<number|string>(props.amountInput||'');

    React.useEffect(() => {
        setAmount(props.amountInput||'');
    }, [props.amountInput])

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountFloat = parseFloat(event.target.value);
        setAmount(amountFloat);
        props.onAmountChange(amountFloat);
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

interface AmountCurrencyInputProps  {
    baseCurrency?: string;
    amountInBaseCurrency?: number;
    onChange: (amount: number, currency: string, amountBase?: number) => void;
    selectedCurrency?: string;
    amountInput?: number;
    label?: string;
}

export const AmountWithCurrencyInput: React.FC<AmountCurrencyInputProps> = (props) => {

    const [amountInBaseCurrency, setAmountInBaseCurrency] = React.useState<number|undefined>(props.amountInBaseCurrency);
    const [currency, setCurrency] = React.useState<string>(props.selectedCurrency||props.baseCurrency||'EUR');
    const [amount, setAmount] = React.useState<number|undefined>(props.amountInput);

    React.useEffect(() => { 
        setAmount(props.amountInput);
    }, [props.amountInput]);
    
    React.useEffect(() => {
        setCurrency(props.selectedCurrency||props.baseCurrency||'EUR');
    }, [props.selectedCurrency, props.baseCurrency]);

    // calculate amount in base currency
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
            props.onChange(amount, currency, calculatedAmount);
        }
        if (props.baseCurrency &&
            currency && 
            amount!==undefined && 
            props.baseCurrency !== currency) {
            calculateAmountInBaseCurrency(amount, props.baseCurrency, currency);
        }
    }, 
    // eslint-disable-next-line
    [
        props.baseCurrency, amount, currency
    ]);

    const handleAmountChange = (amount: number) => {
        props.onChange(amount, currency, amountInBaseCurrency);
        setAmount(amount);
    }

    const handleCurrencyChange = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
        if (amount) {
            props.onChange(amount, selectedCurrency, amountInBaseCurrency);
        }
    }

    const baseAmount = () => {
        if (props.baseCurrency !== currency && amountInBaseCurrency) {
            return `${round(amountInBaseCurrency)} ${props.baseCurrency}`;
        }
        return undefined;
    }

    return (
        <Grid container direction='row' alignItems='baseline'>
            <Grid item>
                <AmountInput 
                    amountInput={amount}
                    label={props.label}
                    onAmountChange={handleAmountChange} helperText={baseAmount()}/>
            </Grid>
            <Grid item >
                <CurrencyInput 
                    selectedCurrency={currency}
                    onCurrencyChange={handleCurrencyChange}/>
            </Grid>
        </Grid>);
}

export default AmountWithCurrencyInput;