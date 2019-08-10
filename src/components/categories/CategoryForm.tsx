import * as React from 'react';
import { Category } from '../../interfaces';
import CategoryInput from './CategoryInput';
import { SaveButtonFab } from '../buttons/SaveButton';
import { uuid } from '../../domain/utils/uuid';

interface CategoryFormProps {
    onSubmit: (category: Category) => void,
    category?: Category;
    iconNames: string[];
}

export const CategoryForm: React.FC<CategoryFormProps> = (props) => {

    const [category, setCategory] = React.useState<Category>(
        props.category ||
        {name: '', icon: 'Label', id: uuid()});
    
    const handleSave = (e: React.SyntheticEvent) => {
        e.preventDefault();
        props.onSubmit(category);
    }
    
    return (
        <form onSubmit={handleSave}>
            <CategoryInput 
                icon={category.icon} 
                name={category.name} 
                id={category.id} 
                onChange={setCategory}
                iconNames={props.iconNames}
                />
            <SaveButtonFab type='submit' color='primary' disabled={category.name === ''} />
        </form>);
}
