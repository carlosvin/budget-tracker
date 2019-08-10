import * as React from 'react';
import { RouterProps } from 'react-router';
import { Category, Categories } from '../../interfaces';
import CategoryInput from '../../components/categories/CategoryInput';
import { HeaderNotifierProps } from '../../routes';
import Typography from '@material-ui/core/Typography';
import { btApp } from '../../BudgetTracker';
import { SaveButtonFab } from '../../components/buttons/SaveButton';
import { AddButton } from '../../components/buttons/AddButton';

export const CategoryList: React.FC<RouterProps&HeaderNotifierProps> = (props) => {
    
    const [categories, setCategories] = React.useState<Categories>({});

    React.useEffect(() => {
        async function fetchCategories () {
            setCategories(await btApp.categoriesStore.getCategories());
        }

        props.onTitleChange('Categories');
        fetchCategories();
        return function () {
            props.onTitleChange('');
        };
    // eslint-disable-next-line
    }, []);

    const [changed, setChanged] = React.useState(false);

    const CategoriesMap = () => {
        if (Object.values(categories).length > 0) {
            const iconNames = btApp.iconsStore.iconNames;
            return (
                <React.Fragment>
                    {Object.values(categories).map(c => 
                        <CategoryInput 
                            {...props} 
                            {...c}
                            iconNames={iconNames}
                            direction='row' 
                            key={`category-entry-${c.id}`}
                            onChange={ handleChange }
                            onDelete={ handleDelete }/>)
                    }
                </React.Fragment>);
        } else {
            return  <Typography variant='h5' color='textSecondary'>There are no categories</Typography>;
        }
    }
    
    const handleChange = (category: Category) => {
        const cats = {...categories};
        cats[category.id] = category;
        setCategories(cats);
        setChanged(true);
    }

    const handleDelete = (id: string) => {
        const cats = {...categories};
        delete cats[id];
        setCategories(cats);
        setChanged(true);
    }

    const handleSave = (e: React.SyntheticEvent) => {
        e.preventDefault();
        btApp.categoriesStore.setCategories(categories);
        setChanged(false);
    }

    return (
        <form onSubmit={handleSave}>
            <CategoriesMap />
            <AddButton href='/categories/add'/>
            <SaveButtonFab type='submit' disabled={!changed}/>
        </form>
    );

}

export default CategoryList;