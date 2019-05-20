import * as React from 'react';
import { categoriesStore } from '../../stores/CategoriesStore';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { RouterProps } from 'react-router';
import { SaveButton, CancelButton, DeleteButton } from '../buttons';
import { TextInput } from '../TextInput';
import { uuid } from '../../utils';
import { CategoryIconButton } from './CategoryIconButton';
import { IconsDialogSelector } from './IconsDialogSelector';
import { Category } from '../../interfaces';
import { CategoryIconType } from '../../stores/IconsStore';

interface CategoryFormProps extends RouterProps, Partial<Category> {
    direction?: GridDirection;
    hideCancel?: boolean;
    closeAfterSave?: boolean;
    onChange?: (categoryId: string) => void;
}

interface CategoryFormState extends Category {
    dialogOpen: boolean;
}

export class CategoryForm extends React.PureComponent<CategoryFormProps, CategoryFormState> {

    constructor(props: CategoryFormProps){
        super(props);
        this.state = {
            name: props.name || '',
            id: props.id || uuid(),
            icon: props.icon || 'Label',
            dialogOpen: false
        };
    }

    render () {
        return (
            <form onSubmit={this.handleSubmit}>
                <Grid container direction={this.direction}>
                    <Grid item>
                        <TextInput 
                            label={ this.direction === 'row' ? '' : 'Category Name' }
                            value={ this.state.name }
                            onChange={this.handleChangeName}
                            style={{ margin: 8 }}
                            margin='dense' />
                    </Grid>
                    <Grid item>
                        <CategoryIconButton 
                            icon={this.state.icon} 
                            onClick={ this.handleClickChangeIcon } 
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
                    selectedValue={this.state.icon}/>
            </form>
        );
    }

    get direction () {
        return this.props.direction || 'column';
    }

    handleCloseDialog = (selectedIcon: CategoryIconType) => {
        this.setState({
            ...this.state,
            icon: selectedIcon,
            dialogOpen: false
        });
    }

    handleClickChangeIcon = () => {
        this.setState({ ...this.state, dialogOpen: true });
    }

    handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, name: event.target.value });
    }

    private handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        categoriesStore.setCategory(this.state);
        this.onChange();
        if (this.props.closeAfterSave) {
            this.close();
        }
    }

    private handleDelete = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (categoriesStore.delete(this.state.id)){
            this.onChange();
        }
        if (this.props.closeAfterSave) {
            this.close();
        }
    }

    private onChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.state.id);
        }
    }
    
    private close = () => {
        if (this.props.history.length > 2) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }
    
}