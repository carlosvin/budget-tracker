import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category } from '../../api';
import { CategoryForm } from '../../components/categories/CategoryForm';
import { goBack } from '../../domain/utils/goBack';
import { CategoryPaths } from '../../domain/paths/CategoryPaths';
import { CloseButtonHistory } from '../../components/buttons/CloseButton';
import { HeaderNotifierProps } from '../../routes';
import { useAppContext } from '../../contexts/AppContext';
import { useHeaderContext } from '../../hooks/useHeaderContext';

export const AddCategory: React.FC<RouterProps&HeaderNotifierProps> = (props) => {
    
    const btApp = useAppContext();

    useHeaderContext('Add category', <CloseButtonHistory history={props.history}/>, props);

    function close () {
        goBack(props.history, CategoryPaths.List);
    }

    async function handleSave (category: Category) {
        await (await btApp.getCategoriesStore()).setCategories([category]);
        close();
    }
    
    return <CategoryForm onSubmit={handleSave}/>;
}

export default AddCategory;