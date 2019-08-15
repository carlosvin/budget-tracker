import * as React from 'react';
import { Category } from '../../interfaces';
import CategoryInput from './CategoryInput';
import { uuid } from '../../domain/utils/uuid';
import MaterialIcon from '@material/react-material-icon';
import { Fab } from '@material/react-fab';

interface CategoryFormProps {
    onSubmit: (category: Category) => void,
    category?: Category;
}

export const CategoryForm: React.FC<CategoryFormProps> = (props) => {

    const [category, setCategory] = React.useState<Category>(
        props.category ||
        {name: '', icon: 'Label', id: uuid()});
    
    const handleSave = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
        props.onSubmit(category);
    }
    
    return (
        <form onSubmit={handleSave}>
            <CategoryInput {...category} onChange={setCategory} />
            <Fab type='submit' disabled={category.name === ''} icon={<MaterialIcon icon='save'/>}/>
        </form>);
}
