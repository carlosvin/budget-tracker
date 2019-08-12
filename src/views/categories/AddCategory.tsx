import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category } from '../../interfaces';
import { HeaderNotifierProps } from '../../routes';
import { CategoryForm } from '../../components/categories/CategoryForm';
import { btApp } from '../../BudgetTracker';
import { CloseButton } from '../../components/buttons/CloseButton';
import { goBack } from '../../domain/utils/goBack';

export const AddCategory: React.FC<RouterProps&HeaderNotifierProps> = (props) => {

    const [iconNames, setIconNames] = React.useState<string[]>([]);
    const handleClose = () => (goBack(props.history, '/categories'));
    
    React.useEffect(() => {
        async function initIconNames () {
            const store = await btApp.getIconsStore();
            setIconNames(store.iconNames);
        }
        initIconNames();
        props.onTitleChange('Add category');
        props.onActions(<CloseButton onClick={handleClose} />);
        return function () {
            props.onActions([]);
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);

    const handleSave = async (category: Category) => {
        await (await btApp.getCategoriesStore()).setCategory(category);
        handleClose();
    }
    
    return <CategoryForm iconNames={iconNames} onSubmit={handleSave}/>;
}

export default AddCategory;