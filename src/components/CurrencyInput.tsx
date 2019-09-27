import React from 'react';
import { TextInput } from './TextInput';
import { useCurrenciesStore } from '../hooks/useCurrenciesStore';

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
    disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {

    const [currencies, setCurrencies] = React.useState();
    const {onCurrencyChange} = props;
    const store = useCurrenciesStore();

    React.useEffect(() => {
        if (store) {
            setCurrencies(store.currencies);
        }
    }, [store]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        if (onCurrencyChange && selectedValue) {
            onCurrencyChange(selectedValue);
        }
    }

    return (
        <TextInput
            label='Currency'
            select
            SelectProps={{ native: true }}
            onChange={handleChange}
            value={props.selectedCurrency}
            required
            disabled={props.disabled || currencies === undefined}
        >
            { currencies === undefined ? 
                <option>Loading...</option> : 
                Object.keys(currencies).map(
                (k: string) => (
                    <option key={`currency-option-${k}`} value={k}>{currencies[k]}</option>))}
        </TextInput>
    );
}
