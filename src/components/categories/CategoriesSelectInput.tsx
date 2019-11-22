import * as React from 'react';
import { TextInput } from '../TextInput';
import { Category } from '../../api';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useLoc } from '../../hooks/useLoc';

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

    const loc = useLoc();

    const handleChange = (e: React.ChangeEvent<{}>, value: Category) => {
        onCategoryChange(value);
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
                    label={label || loc('Category')}
                    helperText={helperText} 
                    required={required}
                    fullWidth />
            )} />);
}
