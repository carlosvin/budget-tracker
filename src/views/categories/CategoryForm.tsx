import * as React from 'react';
import { categoriesStore } from '../../stores/CategoriesStore';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { RouterProps } from 'react-router';
import { SaveButton, CancelButton, DeleteButton } from '../buttons';
import { TextInput } from '../TextInput';
import { TextFieldProps } from '@material-ui/core/TextField';
import { uuid } from '../../utils';
import { CategoryIconButton } from './CategoryIconButton';
import { IconsDialogSelector } from './IconsDialogSelector';
import { iconsStore, Icons } from '../../stores/IconsStore';

interface CategoryFormProps extends RouterProps{
    name?: string;
    categoryId?: string;
    icon?: string;
    direction?: GridDirection;
    hideCancel?: boolean;
    closeAfterSave?: boolean;
    onChange?: (categoryId: string) => void;
}

interface CategoryFormState  {
    name: string; 
    categoryId: string;
    dialogOpen: boolean;
    selectedIcon: string;
}

export class CategoryForm extends React.PureComponent<CategoryFormProps, CategoryFormState> {

    private readonly store = categoriesStore;

    constructor(props: CategoryFormProps){
        super(props);
        this.state = {
            name: props.name || '',
            categoryId: props.categoryId || uuid(),
            dialogOpen: false,
            selectedIcon: iconsStore.defaultIconName
        };
    }

    private handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        this.store.setCategory(this.state.categoryId, this.state.name);
        this.onChange();
        if (this.props.closeAfterSave) {
            this.close();
        }
    }

    private handleDelete = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (this.store.delete(this.state.categoryId)){
            this.onChange();
        }
        if (this.props.closeAfterSave) {
            this.close();
        }
    }

    private onChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.state.categoryId);
        }
    }
    
    private close = () => {
        if (this.props.history.length > 2) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }
    
    render () {
        return (
            <form onSubmit={this.handleSubmit}>
                <Grid container direction={this.direction}>
                    <Grid item>
                        <this.TextInput 
                            label={ this.direction === 'row' ? '' : 'Category Name' }
                            value={ this.state.name }
                            onChange={this.handleChange}
                            style={{ margin: 8 }}
                            margin='dense' />
                    </Grid>
                    <Grid item>
                        <CategoryIconButton 
                            name={this.state.selectedIcon} 
                            onClick={ this.handleIconChange }
                            icon={ iconsStore.getIcon(this.state.selectedIcon) } 
                            />
                    </Grid>
                    
                    <Grid item>
                        <Grid container direction='row' justify='space-around'>
                            <SaveButton type='submit' disabled={this.state.name === ''} />
                            { this.props.name && 
                            <DeleteButton disabled={this.state.name === ''} onClick={this.handleDelete}/> }
                            { !this.props.hideCancel &&
                            <CancelButton  onClick={this.close} />}
                        </Grid>
                    </Grid>
                </Grid>
                <IconsDialogSelector 
                    onClose={this.handleCloseDialog} 
                    open={this.state && this.state.dialogOpen} 
                    selectedValue={this.state.selectedIcon}/>
            </form>
        );
    }

    get direction () {
        return this.props.direction || 'column';
    }

    handleCloseDialog = (selectedIcon: string) => {
        this.setState({
            ...this.state,
            selectedIcon,
            dialogOpen: false
        });
    }

    handleIconChange = () => {
        this.setState({ dialogOpen: true });
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    }

    private TextInput = (props: TextFieldProps) => (
        <TextInput
            {...props}
            onChange={this.handleChange}
        />);
            
}