import * as React from 'react';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { TextInput } from '../TextInput';
import CategoryIconButton from './CategoryIconButton';
import CategoryIconDialogSelector from '../../views/categories/CategoryIconSelector';
import { Category } from '../../interfaces';
import { DeleteButton } from '../buttons/DeleteButton';
import { YesNoDialog } from '../YesNoDialog';

interface CategoryInputProps {
    direction?: GridDirection;
    onDelete?: (id: string) => void;
    onChange: (category: Category) => void;
    category: Category;
}

export const CategoryInput: React.FC<CategoryInputProps> = (props) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [category, setCategory] = React.useState<Category>(props.category);
    
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

    function handleConfirmDelete (confirmed: boolean) {
        setShowDeleteDialog(false);
        if (props.onDelete && confirmed) {
            props.onDelete(props.category.identifier);    
        }
    }

    function handleShowDeleteDialog () {
        setShowDeleteDialog(true);
    }

    return (
        <React.Fragment>
            <Grid container direction={props.direction || 'row'} wrap='nowrap'>
                <Grid item>
                    <TextInput 
                        label={ props.direction === 'row' ? '' : 'Name' }
                        value={ category.name }
                        onChange={ handleChangeName }/>
                </Grid>
                <Grid item>
                    <CategoryIconButton 
                        name={ category.icon } 
                        onClick={ handleClickChangeIcon } />
                </Grid>
                { props.onDelete && <Grid item><DeleteButton onClick={handleShowDeleteDialog}/></Grid> }
            </Grid>
            <CategoryIconDialogSelector 
                onClose={handleCloseDialog} 
                open={dialogOpen} 
                selectedValue={category.icon}/>
            <YesNoDialog 
                open={showDeleteDialog} 
                onClose={handleConfirmDelete}
                question={`Do your really want to delete "${props.category.name}" category?`}
                description='The expenses assigned to this category will be assigned to default.'/>
        </React.Fragment>
    );


}

export default CategoryInput;