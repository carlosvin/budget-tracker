import * as React from 'react';
import { RouterProps } from 'react-router';
import { categoriesStore } from '../../stores/CategoriesStore';
import { AddButton, SaveButton, CancelButton } from '../buttons';
import { Category, Categories } from '../../interfaces';
import { InfoField } from '../InfoField';
import CategoryInput from './CategoryInput';
import { HeaderNotifierProps } from '../../routes';


export const CategoryList: React.FC<RouterProps&HeaderNotifierProps> = (props) => {
   
    const [changed, setChanged] = React.useState(false);
    const { history, onActions, onTitleChange } = props;


    React.useEffect(
        () => {
            onTitleChange('Categories');
            onActions(<React.Fragment>
                <AddButton href='/categories/add'/>
                <SaveButton type='submit' disabled={!changed}/>
                <CancelButton onClick={history.goBack}/>
            </React.Fragment>);
        }, [onActions, onTitleChange, changed, history.goBack]
      );

    const [categories, setCategories] = React.useState<Categories>(categoriesStore.getCategories());


    const CategoriesMap = () => {
        if (Object.values(categories).length > 0) {
            return (
                <React.Fragment>
                    {Object.values(categories).map(c => 
                        <CategoryInput 
                            {...props} 
                            {...c}
                            direction='row' 
                            delete 
                            key={`category-entry-${c.id}`}
                            onChange={ handleChange }
                            onDelete={ handleDelete }/>)
                    }
                </React.Fragment>);
        } else {
            return <InfoField 
                label='There are no categories' 
                value='Please add at least one'/>;
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

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        categoriesStore.setCategories(categories);
    }

    return (
        <form onSubmit={handleSubmit}>
            <CategoriesMap />
        </form>
    );

}

export default CategoryList;