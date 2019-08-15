import * as React from 'react';
import { RouterProps, Redirect } from 'react-router';
import { Category, Categories } from '../../interfaces';
import CategoryInput from '../../components/categories/CategoryInput';
import { HeaderNotifierProps } from '../../routes';
import { btApp } from '../../BudgetTracker';
import { FabButton } from '../../components/buttons';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';

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
                        {...c}
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
    
    const [redirect, setRedirect] = React.useState<string>();
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

    if (redirect) {
        return <Redirect to={redirect}/>;
    }

    return (
        <form onSubmit={handleSave}>
            <CategoriesMap 
                onChange={handleChange} 
                onDelete={handleDelete} 
                categories={viewCategories}/>
            <FabButton path='/categories/add' onRedirect={setRedirect} icon='add'/>
            <Fab icon={<MaterialIcon icon='save'/>} type='submit' disabled={!changed}/>
        </form>
    );

}

export default CategoryList;