import * as React from 'react';
import { RouterProps } from 'react-router';
import { categoriesStore } from '../../stores/CategoriesStore';
import { Category } from '../../interfaces';
import { uuid } from '../../utils';
import CategoryInput from './CategoryInput';
import { HeaderNotifierProps } from '../../routes';
import { CloseButton, SaveButtonFab } from '../buttons';

export const AddCategory: React.FC<RouterProps&HeaderNotifierProps> = (props) => {

    const [category, setCategory] = React.useState<Category>({name: '', icon: 'Label', id: uuid()});

    React.useEffect(() => {
        props.onTitleChange('Add category');
        props.onActions(<CloseButton onClick={close} />);
    });

    const close = () => {
        if (props.history.length > 2) {
            props.history.goBack();
        } else {
            props.history.replace('/categories');
        }
    }
    
    const handleSave = (e: React.SyntheticEvent) => {
        e.preventDefault();
        categoriesStore.setCategory(category);
        close();
    }
    
    return (
        <form onSubmit={handleSave}>
            <CategoryInput 
                icon={category.icon} 
                name={category.name} 
                id={category.id} 
                onChange={setCategory}
                />
            <SaveButtonFab type='submit' disabled={category.name === ''} />
        </form>);
}

export default AddCategory;