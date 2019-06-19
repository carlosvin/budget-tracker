import * as React from 'react';
import { RouterProps } from 'react-router';
import { categoriesStore } from '../../stores/CategoriesStore';
import { AddButton, SaveButtonFab } from '../../components/buttons';
import { Category, Categories } from '../../interfaces';
import CategoryInput from '../../components/CategoryInput';
import { HeaderNotifierProps } from '../../routes';
import { Typography } from '@material-ui/core';

export const CategoryList: React.FC<RouterProps&HeaderNotifierProps> = (props) => {

    React.useEffect(() => {
        props.onTitleChange('Categories');
        return function () {
            props.onTitleChange('');
        };
    // eslint-disable-next-line
    }, []);

    const [changed, setChanged] = React.useState(false);
  
    const [categories, setCategories] = React.useState<Categories>(
        categoriesStore.getCategories());

    const CategoriesMap = () => {
        if (Object.values(categories).length > 0) {
            return (
                <React.Fragment>
                    {Object.values(categories).map(c => 
                        <CategoryInput 
                            {...props} 
                            {...c}
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
        categoriesStore.setCategories(categories);
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