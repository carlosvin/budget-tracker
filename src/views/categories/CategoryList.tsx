import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category, Categories } from '../../interfaces';
import CategoryInput from '../../components/categories/CategoryInput';
import { HeaderNotifierProps } from '../../routes';
import { SaveButtonFab } from '../../components/buttons/SaveButton';
import { AddButton } from '../../components/buttons/AddButton';
import { btApp } from '../../BudgetTracker';
import { CategoryPaths } from '../../domain/paths/CategoryPaths';

interface CategoriesMapProps {
    onDelete: (id: string) => void;
    onChange: (category: Category) => void;
    categories: Categories;
}

const CategoriesMap: React.FC<CategoriesMapProps> = (props) => {
    const CategoriesMemo = React.useMemo(() => (
        <React.Fragment>
            {Object.values(props.categories).map(c => 
                <CategoryInput 
                    category={c}
                    direction='row' 
                    key={`category-entry-${c.id}`}
                    onChange={ props.onChange }
                    onDelete={ props.onDelete }/>)
            }
        </React.Fragment>
    // eslint-disable-next-line
    ), [props.categories]);

    return CategoriesMemo;
}

export const CategoryList: React.FC<RouterProps&HeaderNotifierProps> = (props) => {
    
    const [categories, setCategories] = React.useState<Categories>({});
    const [viewCategories, setViewCategories] = React.useState<Categories>({});

    React.useEffect(() => {
        async function init() {
            setCategories(await (await btApp.getCategoriesStore()).getCategories());
        }
        init();
    }, []);

    React.useEffect(() => {
        setViewCategories({...categories});
    }, [categories]);

    React.useLayoutEffect(() => {
        props.onTitleChange('Categories');
        return function () {
            props.onTitleChange('');
        };
    // eslint-disable-next-line
    }, []);

    const [changed, setChanged] = React.useState(false);

    const handleChange = (category: Category) => {
        viewCategories[category.id] = category;
        setViewCategories(viewCategories);
        setChanged(true);
    }

    const handleDelete = (id: string) => {
        delete viewCategories[id];
        setCategories(viewCategories);
        setChanged(true);
    }

    const handleSave = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await (await btApp.getCategoriesStore()).setCategories(viewCategories);
        setCategories(viewCategories);
        setChanged(false);
    }

    return (
        <form onSubmit={handleSave}>
            <CategoriesMap 
                onChange={handleChange} 
                onDelete={handleDelete} 
                categories={viewCategories}/>
            <AddButton to={CategoryPaths.Add}/>
            <SaveButtonFab type='submit' disabled={!changed} color={'secondary'}/>
        </form>
    );

}

export default CategoryList;