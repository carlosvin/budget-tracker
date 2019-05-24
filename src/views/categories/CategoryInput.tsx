import * as React from 'react';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { SaveButton, CancelButton, DeleteButton } from '../buttons';
import { TextInput } from '../TextInput';
import { uuid } from '../../utils';
import CategoryIconButton from './CategoryIconButton';
import { IconsDialogSelector } from './IconsDialogSelector';
import { Category } from '../../interfaces';
import Actions from '../Actions';

interface CategoryInputProps extends Category {
    direction?: GridDirection;
    cancel?: boolean;
    delete?: boolean;
    save?: boolean;
    onChange?: (category: Category) => void;
    onCancel?: () => void;
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

    const handleDelete = () => (
        props.onDelete && props.onDelete(category.id)
    );

    const handleCancel = () => (
        props.onCancel && props.onCancel()
    );

    const handleCloseDialog = (selectedIcon: string) => {
        if (category.icon !== selectedIcon) {
            const iCategory = {...category, icon: selectedIcon };
            setCategory(iCategory);
            props.onChange && props.onChange(iCategory);
        }
        setDialogOpen(false);        
    }

    return (
        <div>
            <Grid container direction={props.direction || 'column'} wrap='nowrap'>
                <Grid item>
                    <TextInput 
                        label={ props.direction === 'row' ? '' : 'Category Name' }
                        value={ category.name }
                        onChange={ handleChangeName }/>
                </Grid>
                
                <Grid item>
                    <Actions>
                        <CategoryIconButton 
                            name={ category.icon } 
                            onClick={ handleClickChangeIcon } />
                        { props.save && <SaveButton type='submit' disabled={category.name === ''} />}
                        { props.delete && <DeleteButton disabled={category.name === ''} onClick={handleDelete}/> }
                        { props.cancel &&
                        <CancelButton onClick={handleCancel} />}
                    </Actions>
                </Grid>
            </Grid>
            <IconsDialogSelector 
                onClose={handleCloseDialog} 
                open={dialogOpen} 
                selectedValue={category.icon}/>
        </div>
    );
}

export default CategoryInput;