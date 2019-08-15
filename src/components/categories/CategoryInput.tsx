import * as React from 'react';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { TextInput } from '../TextInput';
import CategoryIconButton from './CategoryIconButton';
import CategoryIconDialogSelector from '../../views/categories/CategoryIconSelector';
import { Category } from '../../interfaces';
import MaterialIcon from '@material/react-material-icon';

interface CategoryInputProps extends Category {
    direction?: GridDirection;
    onDelete?: (id: string) => void;
    onChange: (category: Category) => void;
}

export const CategoryInput: React.FC<CategoryInputProps> = (props) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [category, setCategory] = React.useState<Category>(props);

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const name = event.target.value;
        const cat = { ...category, name };
        setCategory(cat);
        props.onChange(cat);
    }

    const handleClickChangeIcon = () => {
        setDialogOpen(true);
    }

    const handleCloseDialog = (selectedIcon: string) => {
        if (category.icon !== selectedIcon) {
            const cat = {...category, icon: selectedIcon };
            setCategory(cat);
            props.onChange(cat);
        }
        setDialogOpen(false);        
    }

    const handleDelete = () => {
        props.onDelete && props.onDelete(props.id);
    }

    return (
        <div>
            <Grid container direction={props.direction || 'row'} wrap='nowrap'>
                <Grid item>
                    <TextInput 
                        label={ props.direction === 'row' ? '' : 'Category Name' }
                        value={ category.name }
                        onChange={ handleChangeName }/>
                </Grid>
                <Grid item>
                    <CategoryIconButton 
                        name={ category.icon } 
                        onClick={ handleClickChangeIcon } />
                </Grid>
                { props.onDelete && <Grid item><MaterialIcon icon='delete' onClick={handleDelete}/></Grid> }
            </Grid>
            <CategoryIconDialogSelector 
                onClose={handleCloseDialog} 
                open={dialogOpen} 
                selectedValue={category.icon}/>
        </div>
    );


}

export default CategoryInput;