import * as React from 'react';
import { RouterProps } from 'react-router';
import { categoriesStore } from '../../stores/CategoriesStore';
import { AddButton, SaveButton, CancelButton } from '../buttons';
import { Category, TitleNotifierProps, Categories } from '../../interfaces';
import { InfoField } from '../InfoField';
import CategoryInput from './CategoryInput';
import Actions from '../Actions';


export const CategoryList: React.FC<RouterProps&TitleNotifierProps> = (props) => {
    props.onTitleChange('Categories');

    const [categories, setCategories] = React.useState<Categories>(categoriesStore.getCategories());
    const [changed, setChanged] = React.useState(false);

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
            <Actions>
                <AddButton href='/categories/add'/>
                <SaveButton type='submit' disabled={!changed}/>
                <CancelButton onClick={props.history.goBack}/>
            </Actions>
        </form>
    );

}

export default CategoryList;