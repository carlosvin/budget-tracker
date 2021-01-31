import * as React from 'react';
import { TextInput } from './TextInput';
import { CountryEntry } from '../api';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useCountriesStore } from '../hooks/useCountriesStore';
import { useLocalization } from '../hooks/useLocalization';

interface CountryInputProps {
    onChange: (countryCode: string) => void;
    disabled?: boolean;
    selected: string;
}

export const CountryInput: React.FC<CountryInputProps> = ({selected, disabled, onChange}) => {
    const loc = useLocalization();
    const store = useCountriesStore();
    const [country, setCountry] = React.useState<CountryEntry>();

    const countries: CountryEntry[] = React.useMemo(
        () => (store ? store.countries : []), [store]);

    React.useEffect(() => {
        setCountry(countries.find(c => c.code === selected));
    }, [selected, countries]);

    function handleChange (event: React.ChangeEvent<{}>, value: CountryEntry|null) {
        if (value !== null) {
            onChange(value.code);
        }
    }

    if (countries.length > 0 && country) {
        return <Autocomplete
            id='countries-input-autocomplete'
            options={countries} 
            onChange={handleChange}
            value={country}
            defaultValue={countries[0]}
            getOptionLabel={(option: CountryEntry) => option.name}
            getOptionSelected={(option, value) => option.code === value.code}
            loading={countries.length === 0}
            style={{marginRight: '1rem'}}
            disableClearable autoComplete
            renderInput={(params: any) => (
                <TextInput {...params} 
                    label={loc.get('Country')}
                    disabled={disabled}
                    required fullWidth />
            )} />;
    } else {
        return <p>loading...</p>;
    }
}

export default CountryInput;
