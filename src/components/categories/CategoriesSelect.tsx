import * as React from 'react';
import MuiLink from '@material-ui/core/Link';
import { CategoriesMap, Category } from '../../api';
import { CategoryFormDialog } from './CategoryFormDialog';
import { useAppContext } from '../../contexts/AppContext';
import { useLoc } from '../../hooks/useLoc';
import { useCategoriesStore } from '../../hooks/useCategoriesStore';
import { CategoriesSelectInput } from './CategoriesSelectInput';

interface CategoriesSelectProps {
    onCategoryChange: (categoryId: string) => void;
    selectedCategory: string;
}

export const CategoriesSelect: React.FC<CategoriesSelectProps> = ({selectedCategory, onCategoryChange}) => {

    const btApp = useAppContext();
    const loc = useLoc();

    const [categories, setCategories] = React.useState<CategoriesMap>();

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

    function handleAddCategoryClick (e: React.SyntheticEvent) {
        e.preventDefault();
        setAddCategoryOpen(true);
    }

    async function handleAddCategoryClose (category?: Category) {
        setAddCategoryOpen(false);
        if (category) {
            const store = await btApp.getCategoriesStore();
            await store.setCategories([category]);
            setCategories({...categories, category});
            onCategoryChange(category.identifier);
        }
    }
    
    function handleChange (selected: Category) {
        onCategoryChange(selected.identifier);
    }

    if (categories) {
        return (<React.Fragment>
            <CategoriesSelectInput
                categories={Object.values(categories)}
                onCategoryChange={handleChange}
                defaultCategory={categories[selectedCategory]}
                helperText={
                    <MuiLink onClick={handleAddCategoryClick}>
                        {loc('Add category')}
                    </MuiLink>}
                />
            <CategoryFormDialog
                open={addCategoryOpen} 
                onClose={handleAddCategoryClose} />
        </React.Fragment>);
    } else {
        return null;
    }
}

export default CategoriesSelect;
