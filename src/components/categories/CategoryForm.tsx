import * as React from 'react';
import { Category } from '../../interfaces';
import CategoryInput from './CategoryInput';
import { SaveButtonFab } from '../buttons/SaveButton';
import { uuid } from '../../domain/utils/uuid';

interface CategoryFormProps {
    onSubmit: (category: Category) => void,
    category?: Category;
}

export const CategoryForm: React.FC<CategoryFormProps> = (props) => {

    const [category, setCategory] = React.useState<Category>(
        props.category ||
        {name: '', icon: 'Label', identifier: uuid()});
    
    const handleSave = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
        props.onSubmit(category);
    }
    
    return (
        <form onSubmit={handleSave}>
            <CategoryInput category={category} onChange={setCategory} />
            <SaveButtonFab type='submit' color='primary' disabled={category.name === ''} />
        </form>);
}
