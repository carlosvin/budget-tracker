import React from 'react';
import { TextInput } from './TextInput';
import { useAppContext } from '../contexts/AppContext';

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
    disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {

    const [currencies, setCurrencies] = React.useState();
    const [selected, setSelected] = React.useState(props.selectedCurrency);
    const {onCurrencyChange} = props;
    const btApp = useAppContext();

    React.useEffect(() => {
        async function initCurrencies () {
            setCurrencies((await btApp.getCurrenciesStore()).currencies);
        }
        initCurrencies();
    }, [btApp]);

    React.useEffect(() => {
        setSelected(props.selectedCurrency);
    }, [props.selectedCurrency]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        setSelected(selectedValue);
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
