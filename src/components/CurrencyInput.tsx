import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextInput } from './TextInput';
import { useLocalization } from '../hooks/useLocalization';

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    currencies: Map<string, string>;
    valuesToTop: string[];
    selectedCurrency: string;
    disabled?: boolean;
}

interface CurrencyOption {
    code: string;
    name: string;
}

function createOption (currencies: Map<string, string>, code: string): CurrencyOption {
    return {code, name: currencies.get(code) || code };
}

export const CurrencyInput: React.FC<CurrencyInputProps> = (props) => {

    const {onCurrencyChange, selectedCurrency, valuesToTop, currencies} = props;
    const loc = useLocalization();

    const [value, setValue] = React.useState<CurrencyOption>(
        createOption(currencies, selectedCurrency));
    
    const options = React.useMemo(() => {
        const opts: CurrencyOption[] = [];
        const currenciesMix = new Set([...valuesToTop, ...currencies.keys()]);
        for (const code of currenciesMix) {
            opts.push(createOption(currencies, code));
        }
        return opts;
    }, [currencies, valuesToTop]);

    React.useEffect(() => {
        const name = currencies.get(selectedCurrency);
        name && setValue({code: selectedCurrency, name});
    }, [currencies, selectedCurrency]);

    function handleChange(event: React.ChangeEvent<any>, currencyOpt: CurrencyOption|null) {
        if (currencyOpt !== null) {
            event.preventDefault();
            setValue(currencyOpt);
            if (currencyOpt && currencyOpt.code) {
                onCurrencyChange(currencyOpt.code);
            }
    
        }
    }

    return (
        <Autocomplete
            id='currencies-input-autocomplete'
            options={options} 
            onChange={handleChange}
            defaultValue={value}
            value={value}
            getOptionLabel={(option: CurrencyOption) => option.name}
            getOptionSelected={(option, value) => option.code === value.code}
            loading={options.length === 0}
            disableClearable autoComplete
            style={{marginRight: '1rem'}}
            renderInput={(params: any) => (
                <TextInput {...params} 
                    label={loc.get('Currency')}
                    disabled={props.disabled}
                    required
                    fullWidth />
            )}
        />
    );
}
