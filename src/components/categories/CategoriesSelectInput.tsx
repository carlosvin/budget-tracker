import * as React from 'react';
import { TextInput } from '../TextInput';
import { Category } from '../../api';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useLoc } from '../../hooks/useLoc';

interface CategoriesSelectInputProps {
    onCategoryChange: (category: Category) => void;
    categories: Category[];
    defaultCategory?: Category;
    helperText?: React.ReactNode;
}

export const CategoriesSelectInput: React.FC<CategoriesSelectInputProps> = ({
    onCategoryChange, 
    categories, 
    helperText, 
    defaultCategory}) => {

    const loc = useLoc();

    const handleChange = (e: React.ChangeEvent<{}>, value: Category) => {
        onCategoryChange(value);
    }

    return (
        <Autocomplete
            id='categories-input-autocomplete'
            options={categories} 
            onChange={handleChange}
            defaultValue={defaultCategory || categories[0]}
            getOptionLabel={(option: Category) => option.name}
            disableClearable autoComplete
            renderInput={(params: any) => (
                <TextInput {...params} 
                    label={loc('Category')}
                    helperText={helperText} 
                    required 
                    fullWidth />
            )} />);
}
