import * as React from 'react';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { TextInput } from '../TextInput';
import { uuid } from '../../utils';
import CategoryIconButton from './CategoryIconButton';
import { IconsDialogSelector } from './IconsDialogSelector';
import { Category } from '../../interfaces';
import { DeleteButton } from '../buttons';

interface CategoryInputProps extends Category {
    direction?: GridDirection;
    onChange?: (category: Category) => void;
    onDelete?: (id: string) => void;
}

export const CategoryInput: React.FC<CategoryInputProps> = (props) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [category, setCategory] = React.useState<Category>({
        id: props.id || uuid(), 
        name: props.name || '',
        icon: props.icon || 'Label'
    });

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const name = event.target.value;
        const cat = {
            ...category,
            name
        };
        setCategory(cat);
        props.onChange && props.onChange(cat);
    }

    const handleClickChangeIcon = () => {
        setDialogOpen(true);
    }

    const handleCloseDialog = (selectedIcon: string) => {
        if (category.icon !== selectedIcon) {
            const iCategory = {...category, icon: selectedIcon };
            setCategory(iCategory);
            props.onChange && props.onChange(iCategory);
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
                { props.onDelete && <Grid item><DeleteButton onClick={handleDelete}/></Grid> }
            </Grid>
            <IconsDialogSelector 
                onClose={handleCloseDialog} 
                open={dialogOpen} 
                selectedValue={category.icon}/>
        </div>
    );


}

export default CategoryInput;