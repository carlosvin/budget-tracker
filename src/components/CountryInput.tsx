import * as React from 'react';
import { TextInput } from './TextInput';
import { CountryEntry } from '../api';
import { useCountriesStore } from '../hooks/useCountriesStore';
import { useLoc } from '../hooks/useLoc';

interface CountryInputProps {
    onCountryChange: (countryCode: string) => void;
    selectedCountry: string;
}

export const CountryInput: React.FC<CountryInputProps> = (props) => {
    const loc = useLoc();
    const [countries, setCountries] = React.useState<CountryEntry[]>([{name: loc('Countries'), code: props.selectedCountry}]);
    const countriesStore = useCountriesStore();

    React.useEffect(() => {
        countriesStore && setCountries(countriesStore.countries);
    }, [countriesStore]);

    function handleCountryChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.onCountryChange(e.target.value);
    }

    return (<TextInput
        label={loc('Country')}
        onChange={handleCountryChange}
        value={props.selectedCountry}
        select
        required 
        SelectProps={{ native: true }} >
        {
            countries
                .map(c => (
                    <option 
                        key={`country-option-${c.code}`} 
                        value={c.code}>
                        {c.name}
                    </option>))}
    </TextInput>);
}

export default CountryInput;
