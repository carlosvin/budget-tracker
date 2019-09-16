import * as React from 'react';
import { TextInput } from './TextInput';
import { btApp } from '../BudgetTracker';
import { CountryEntry } from '../interfaces';

interface CountryInputProps {
    onCountryChange: (countryCode: string) => void;
    selectedCountry: string;
}

export const CountryInput: React.FC<CountryInputProps> = (props) => {

    const [countries, setCountries] = React.useState<CountryEntry[]>([]);

    React.useEffect(() => {
        const initCountries = async () => {
            setCountries((await btApp.getCountriesStore()).countries);
        }
        initCountries();
    }, []);

    const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onCountryChange(e.target.value);
    }

    if (countries && countries.length > 0) {
        return (<TextInput
            label='Country'
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
    } else {
        return <span>Loading countries...</span>;
    }
}

export default CountryInput;
