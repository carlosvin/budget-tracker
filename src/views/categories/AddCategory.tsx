import * as React from 'react';
import { RouterProps } from 'react-router';
import { categoriesStore } from '../../stores/CategoriesStore';
import { Category, TitleNotifierProps } from '../../interfaces';
import { uuid } from '../../utils';
import CategoryInput from './CategoryInput';

export const AddCategory: React.FC<RouterProps&TitleNotifierProps> = (props) => {
    props.onTitleChange('Add category');
    const [category, setCategory] = React.useState<Category>({name: '', icon: 'Label', id: uuid()});

    const close = () => {
        if (props.history.length > 2) {
            props.history.goBack();
        } else {
            props.history.replace('/categories');
        }
    }
    
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        categoriesStore.setCategory(category);
        close();
    }
    
    return (
    <form onSubmit={handleSubmit}>
        <CategoryInput 
            icon={category.icon} 
            name={category.name} 
            id={category.id} 
            save cancel 
            onChange={setCategory}
            onCancel={close}/>
    </form>);
}

export default AddCategory;