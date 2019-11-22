import * as React from 'react';
import { TextInput } from './TextInput';
import { CountryEntry } from '../api';
import { useLoc } from '../hooks/useLoc';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useCountriesStore } from '../hooks/useCountriesStore';

interface CountryInputProps {
    onChange: (countryCode: string) => void;
    disabled?: boolean;
    selected: string;
}

export const CountryInput: React.FC<CountryInputProps> = ({selected, disabled, onChange}) => {
    const loc = useLoc();
    const store = useCountriesStore();

    const {countries, defaultValue} = React.useMemo(
        () => (store ? 
            {
                countries: store.countries,
                defaultValue: store.countries.find(c => c.code === selected)
            } : 
            {countries: [], defaultValue: undefined}),
        // eslint-disable-next-line
        [store]);

    function handleChange (event: React.ChangeEvent<{}>, value: CountryEntry) {
        onChange(value.code);
    }

    return ( countries.length > 0 ? 
        <Autocomplete
            id='currencies-input-autocomplete'
            options={countries} 
            onChange={handleChange}
            defaultValue={defaultValue}
            getOptionLabel={(option: CountryEntry) => option.name}
            loading={!defaultValue}
            style={{marginRight: '1rem'}}
            disableClearable autoComplete
            renderInput={(params: any) => (
                <TextInput {...params} 
                    label={loc('Country')}
                    disabled={disabled}
                    required fullWidth />
            )}
        /> : <p>loading</p>
    );
}

export default CountryInput;
