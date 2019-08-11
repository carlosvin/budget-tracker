import * as React from 'react';
import { TextInput } from './TextInput';
import { btApp } from '../BudgetTracker';

// TODO var formatter = new Intl.NumberFormat('de-DE', { 
  //style: 'currency', 
  //currency: 'EUR' 
//});

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
    disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {

    const [currencies, setCurrencies] = React.useState();
    const [selected, setSelected] = React.useState(props.selectedCurrency);
    const {onCurrencyChange} = props;

    React.useEffect(() => {
        async function initCurrencies () {
            setCurrencies(await btApp.currenciesStore.getCurrencies());
        }

        initCurrencies();
    }, []);

    React.useEffect(() => {
        if (onCurrencyChange && selected) {
            onCurrencyChange(selected);
        }
        // eslint-disable-next-line
    }, [selected]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(event.target.value);
    }

    return (
        <TextInput
            label='Currency'
            select
            SelectProps={{ native: true }}
            onChange={handleChange}
            value={selected}
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
