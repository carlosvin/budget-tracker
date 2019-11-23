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
    const [country, setCountry] = React.useState();

    const countries: CountryEntry[] = React.useMemo(
        () => (store ? store.countries : []), [store]);

    React.useEffect(() => {
        setCountry(countries.find(c => c.code === selected));
    }, [selected, countries]);

    function handleChange (event: React.ChangeEvent<{}>, value: CountryEntry) {
        onChange(value.code);
    }

    if (countries.length > 0 && country) {
        return <Autocomplete
            id='countries-input-autocomplete'
            options={countries} 
            onChange={handleChange}
            value={country}
            defaultValue={countries[0]}
            getOptionLabel={(option: CountryEntry) => option.name}
            loading={countries.length === 0}
            style={{marginRight: '1rem'}}
            disableClearable autoComplete
            renderInput={(params: any) => (
                <TextInput {...params} 
                    label={loc('Country')}
                    disabled={disabled}
                    required fullWidth />
            )} />;
    } else {
        return <p>loading...</p>;
    }
}

export default CountryInput;
