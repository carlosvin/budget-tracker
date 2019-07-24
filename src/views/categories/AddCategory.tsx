import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category } from '../../interfaces';
import { HeaderNotifierProps } from '../../routes';
import { CategoryForm } from '../../components/categories/CategoryForm';
import { btApp } from '../../BudgetTracker';
import { CloseButton } from '../../components/buttons/CloseButton';

export const AddCategory: React.FC<RouterProps&HeaderNotifierProps> = (props) => {

    const closeView = () => {
        if (props.history.length > 2) {
            props.history.goBack();
        } else {
            props.history.replace('/categories');
        }
    }
    
    React.useEffect(() => {
        props.onTitleChange('Add category');
        props.onActions(<CloseButton onClick={closeView} />);
        return function () {
            props.onActions([]);
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);

    const handleSave = (category: Category) => {
        btApp.categoriesStore.setCategory(category);
        closeView();
    }
    
    return <CategoryForm onSubmit={handleSave}/>;
}

export default AddCategory;