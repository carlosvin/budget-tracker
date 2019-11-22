import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CurrencyInput } from "./CurrencyInput";
import { AmountInput } from "./AmountInput";
import applyRate from "../domain/utils/applyRate";
import { getCurrencyWithSymbol } from "../domain/utils/getCurrencyWithSymbol";
import { useLoc } from "../hooks/useLoc";
import { useCurrenciesStore } from "../hooks/useCurrenciesStore";
import { CurrenciesStore } from "../domain/stores/interfaces";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

interface AmountCurrencyInputProps  {
    selectedCurrency: string;
    baseCurrency: string;
    amountInBaseCurrency?: number;
    onChange: (amount: number, currency: string, amountBase: number) => void;
    amountInput?: number;
    label: string;
    disabled?: boolean;
    onError?: (error?: string) => void;
}

export const AmountWithCurrencyInput: React.FC<AmountCurrencyInputProps> = (props) => {

    const loc  = useLoc();
    const [error, setError] = React.useState<string|undefined>(); 
    const {baseCurrency, selectedCurrency, amountInput} = props;
    const store = useCurrenciesStore();

    const [rate, setRate] = React.useState<number|undefined>(0);

    const {onChange, onError} = props;

    React.useEffect(() => {
        async function fetch (store: CurrenciesStore) {
            try {
                const rate = await store.getRate(baseCurrency, selectedCurrency);
                setRate(rate);    
            } catch (error) {
                console.warn(error);
                setError(error);
            }
        }

        function setLocalRate (store: CurrenciesStore) {
            const localRates = store.getLocalRates(baseCurrency);
            if (localRates && selectedCurrency in localRates) {
                setRate(localRates.rates[selectedCurrency]);
            }
        }

        if (baseCurrency === selectedCurrency) {
            setRate(1);
        } else if (store) {
            setLocalRate(store);
            fetch(store);
        }
    }, [baseCurrency, selectedCurrency, store]);

    React.useEffect(() => {
        if (rate !== undefined && amountInput !== undefined) {
            const amountBase = applyRate(amountInput, rate);
            setError(undefined);
            onChange(amountInput, selectedCurrency, amountBase);
        }
    // eslint-disable-next-line
    }, [rate, amountInput, selectedCurrency]);

    function handleChange(amount: number, currency: string) {
        setError(undefined);
        onChange(amount, currency, 0);
    }

    React.useEffect(() => (onError && onError(error)), [error, onError]);

    const baseAmountString = () => {
        if (baseCurrency !== props.selectedCurrency && props.amountInBaseCurrency) {
            return getCurrencyWithSymbol(props.amountInBaseCurrency, baseCurrency);
        }
        return undefined;
    }

    function handleCurrencyChange (currency: string) {
        setRate(undefined);
        handleChange(amountInput || 0, currency);
    }

    function handleAmountChange (amount: number) {
        handleChange(amount, selectedCurrency);
    }
    
    return (<Grid container spacing={2}>
                <Grid item xs>
                    <AmountInput
                        amountInput={amountInput}
                        label={props.label}
                        onAmountChange={handleAmountChange}
                        helperText={baseAmountString()} 
                        disabled={props.disabled}
                        />
                </Grid>
                
                { store && <Grid item xs>
                    <CurrencyInput 
                    currencies={store.currencies}
                    valuesToTop={[...store.lastCurrenciesUsed]}
                    selectedCurrency={props.selectedCurrency}
                    onCurrencyChange={handleCurrencyChange} 
                    disabled={props.disabled}/>
                    </Grid>
                }
            { error !== undefined && 
            <Card>
                <CardContent>
                    <Typography color='error'>{loc('Error converting to base')}.</Typography>
                    <Typography color='textPrimary'>{loc('Still add amount in base')}.</Typography>
                    <Typography color='textSecondary'>{loc('Connect to get last rates')}.</Typography>
                </CardContent>
            </Card> }
        </Grid>);
}

export default AmountWithCurrencyInput;
