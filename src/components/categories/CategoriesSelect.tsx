import * as React from 'react';
import { TextInput } from '../TextInput';
import MuiLink from '@material-ui/core/Link';
import { CategoriesMap, Category } from '../../api';
import { CategoryFormDialog } from './CategoryFormDialog';
import { useAppContext } from '../../contexts/AppContext';
import { useLoc } from '../../hooks/useLoc';
import { useCategoriesStore } from '../../hooks/useCategoriesStore';

interface CategoriesSelectProps {
    onCategoryChange: (categoryId: string) => void;
    selectedCategory: string;
}

const CategoryOptions: React.FC<{categories: CategoriesMap}> = (props) => {

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

    const {selectedCategory, onCategoryChange} = props;
    const btApp = useAppContext();
    const loc = useLoc();
    const [categories, setCategories] = React.useState<CategoriesMap>(
        {[selectedCategory]: {
            identifier: selectedCategory, 
            name: '...', icon: ''}});
    const [addCategoryOpen, setAddCategoryOpen] = React.useState(false);

    const store = useCategoriesStore();

    React.useEffect(() => {
        async function initCategories () {
            if (store) {
                const cs = await store.getCategories();
                if (!(selectedCategory in cs)) {
                    onCategoryChange(Object.keys(cs)[0]);
                }
                setCategories(cs);   
            }
        }
        initCategories();
    // eslint-disable-next-line
    }, [store]);

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
            onCategoryChange(category.identifier);
        }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCategoryChange(e.target.value);
    }

    return (
        <React.Fragment>
            <TextInput
                label={loc('Category')}
                onChange={handleChange}
                value={selectedCategory}
                helperText={
                    <MuiLink onClick={handleAddCategoryClick}>
                        {loc('Add category')}
                    </MuiLink>}
                select required 
                SelectProps={{ native: true }} >
                <CategoryOptions categories={categories}/>
            </TextInput>
            <CategoryFormDialog
                open={addCategoryOpen} 
                onClose={handleAddCategoryClose} />
        </React.Fragment>
    );
}

export default CategoriesSelect;
