import React from 'react';
import { TextInput } from './TextInput';
import { useCurrenciesStore } from '../hooks/useCurrenciesStore';
import { useLoc } from '../hooks/useLoc';

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
    disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {

    const {onCurrencyChange} = props;
    const store = useCurrenciesStore();
    const loc = useLoc();

    const options = React.useMemo(() => {
        function createOption (k: string, v: string) {
            return <option key={`currency-option-${k}`} value={k}>{v}</option>;
        }

        const opts: React.ReactElement[] = [];
        if (store) {
            const {currencies, lastCurrenciesUsed} = store;
            const currenciesMix = new Set([...lastCurrenciesUsed, ...currencies.keys()]);
            for (const code of currenciesMix) {
                const name = currencies.get(code);
                name && opts.push(createOption(code, name));
            }
        } else {
            opts.push(createOption('loading', 'Loading'));
        }
        return opts;
    }, [store]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedValue = event.target.value;
        if (onCurrencyChange && selectedValue) {
            onCurrencyChange(selectedValue);
        }
    }

    return (
        <TextInput
            label={loc('Currency')}
            select
            SelectProps={{ native: true }}
            onChange={handleChange}
            value={props.selectedCurrency}
            required
            disabled={props.disabled}
        >
            { options }
        </TextInput>
    );
}
