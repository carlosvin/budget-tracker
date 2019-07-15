import * as React from 'react';
import { TextInput } from './TextInput';
import { Link } from '@material-ui/core';
import { MyLink } from './MyLink';
import { Categories, Category } from '../interfaces';
import { btApp } from '../BudgetTracker';
import { CategoryFormDialog } from './CategoryFormDialog';

interface CategoriesSelectProps {
    onCategoryChange: (categoryId: string) => void;
    selectedCategory: string;
}

const CategoryOptions: React.FC<{categories: Categories}> = (props) => {

    return <React.Fragment>
        { Object.entries(props.categories).map(
            ([k, v]) => (
                <option 
                    key={`category-option-${k}`} 
                    value={v.id}>
                    {v.name}
                </option>))}
    </React.Fragment>;   
}

export const CategoriesSelect: React.FC<CategoriesSelectProps> = (props) => {

    const {selectedCategory} = props;

    const [categories, setCategories] = React.useState<Categories>();
    const [addCategoryOpen, setAddCategoryOpen] = React.useState(false);

    React.useEffect(() => {
        const initCategories = async () => {
            const cs = await btApp.categoriesStore.getCategories();
            setCategories(cs);
        }
        initCategories();
    // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (!selectedCategory && categories) {
            props.onCategoryChange(Object.keys(categories)[0]);
        }
    // eslint-disable-next-line
    }, [selectedCategory, categories]);

    const handleAddCategoryClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setAddCategoryOpen(true);
    }

    const handleAddCategoryClose = (category?: Category) => {
        if (category) {
            btApp.categoriesStore.setCategory(category);
            setCategories({...categories, category});
            props.onCategoryChange(category.id);
        }
        setAddCategoryOpen(false);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onCategoryChange(e.target.value);
    }

    if (categories) {
        return (
            <React.Fragment>
                <TextInput
                    label='Category'
                    onChange={handleChange}
                    value={props.selectedCategory}
                    helperText={
                        <Link component={MyLink} onClick={handleAddCategoryClick}>Add category</Link>}
                    select
                    required 
                    SelectProps={{ native: true }} >
                    <CategoryOptions categories={categories}/>
                </TextInput>
                <CategoryFormDialog
                    open={addCategoryOpen} 
                    onClose={handleAddCategoryClose} />
            </React.Fragment>
        );
    } else {
        return <span>Loading categories...</span>;
    }
}

export default CategoriesSelect;
