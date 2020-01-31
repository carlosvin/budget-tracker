import * as React from 'react';
import { TextInput } from '../TextInput';
import { Category } from '../../api';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useLocalization } from '../../hooks/useLocalization';

interface CategoriesSelectInputProps {
    onCategoryChange: (category: Category) => void;
    categories: Category[];
    selected?: Category;
    helperText?: React.ReactNode;
    required?: boolean;
    label?: string;
}

export const CategoriesSelectInput: React.FC<CategoriesSelectInputProps> = ({
    onCategoryChange, 
    categories, 
    helperText, 
    required,
    label,
    selected}) => {

    const loc = useLocalization();

    const handleChange = (e: React.ChangeEvent<{}>, value: Category|null) => {
        if (value !== null) {
            onCategoryChange(value);
        }
    }

    return (
        <Autocomplete
            id='categories-input-autocomplete'
            options={categories}
            onChange={handleChange}
            value={selected || categories[0]}
            getOptionLabel={(option: Category) => option.name}
            disableClearable autoComplete 
            style={{marginRight: '1rem'}}
            renderInput={(params: any) => (
                <TextInput {...params} 
                    label={label || loc.get('Category')}
                    helperText={helperText} 
                    required={required}
                    fullWidth />
            )} />);
}
