import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category } from '../../interfaces';
import { CategoryForm } from '../../components/categories/CategoryForm';
import { goBack } from '../../domain/utils/goBack';
import { CategoryPaths } from '../../domain/paths/CategoryPaths';
import { CloseButtonHistory } from '../../components/buttons/CloseButton';
import { HeaderNotifierProps } from '../../routes';
import { useAppContext } from '../../contexts/AppContext';

export const AddCategory: React.FC<RouterProps&HeaderNotifierProps> = (props) => {
    
    const btApp = useAppContext();

    React.useEffect(() => {
        
        props.onTitleChange('Add category');
        props.onActions(<CloseButtonHistory history={props.history}/>);
        return function () {
            props.onActions(undefined);
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);

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