import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category } from '../../interfaces';
import { HeaderNotifierProps } from '../../routes';
import { CategoryForm } from '../../components/categories/CategoryForm';
import { btApp } from '../../BudgetTracker';
import { goBack } from '../../domain/utils/goBack';
import { CategoryPaths } from '../../domain/paths/CategoryPaths';
import { CloseButton } from '../../components/buttons/CloseButton';

export const AddCategory: React.FC<RouterProps&HeaderNotifierProps> = (props) => {
    
    React.useEffect(() => {
        
        props.onTitleChange('Add category');
        props.onActions([<CloseButton history={props.history}/>]);
        return function () {
            props.onActions([]);
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);

    function close () {
        goBack(props.history, CategoryPaths.List);
    }

    async function handleSave (category: Category) {
        await (await btApp.getCategoriesStore()).setCategory(category);
        close();
    }
    
    return <CategoryForm onSubmit={handleSave}/>;
}

export default AddCategory;