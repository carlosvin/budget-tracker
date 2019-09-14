import * as React from 'react';
import { TextInput } from '../TextInput';
import MuiLink from '@material-ui/core/Link';
import { Categories, Category } from '../../interfaces';
import { btApp } from '../../BudgetTracker';
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
                    value={v.identifier}>
                    {v.name}
                </option>))}
    </React.Fragment>;   
}

export const CategoriesSelect: React.FC<CategoriesSelectProps> = (props) => {

    const {selectedCategory} = props;

    const [categories, setCategories] = React.useState<Categories>();
    const [addCategoryOpen, setAddCategoryOpen] = React.useState(false);

    React.useEffect(() => {
        async function initCategories () {
            const store = await btApp.getCategoriesStore();
            const cs = await store.getCategories();
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

    const handleAddCategoryClose = async (category?: Category) => {
        setAddCategoryOpen(false);
        if (category) {
            const store = await btApp.getCategoriesStore();
            await store.setCategories([category]);
            setCategories({...categories, category});
            props.onCategoryChange(category.identifier);
        }
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
                    value={selectedCategory}
                    helperText={
                        <MuiLink onClick={handleAddCategoryClick}>
                            Add category
                        </MuiLink>}
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
