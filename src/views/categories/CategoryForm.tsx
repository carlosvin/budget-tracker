import * as React from 'react';
import { categoriesStore } from '../../stores/CategoriesStore';

import Grid, { GridDirection } from '@material-ui/core/Grid';
import { RouterProps } from 'react-router';
import { SaveButton, CancelButton, DeleteButton } from '../buttons';
import { TextInput } from '../TextInput';
import { TextFieldProps } from '@material-ui/core/TextField';

interface CategoryFormProps extends RouterProps{
    name?: string;
    direction?: GridDirection;
    hideCancel?: boolean;
    closeAfterSave?: boolean;
    onChange?: () => void;
}

export class CategoryForm extends React.PureComponent<CategoryFormProps, {name: string}> {

    private readonly store = categoriesStore;

    constructor(props: CategoryFormProps){
        super(props);
        this.state = {name: props.name || ''};
    }

    private handleSubmit = () => {
        this.store.add(this.state.name);
        if (this.props.onChange) {
            this.props.onChange();
        }
        if (this.props.closeAfterSave) {
            this.close();
        }
    }

    private handleDelete = () => {
        this.store.delete(this.state.name);
        if (this.props.onChange) {
            this.props.onChange();
        }
        if (this.props.closeAfterSave) {
            this.close();
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
                        <Grid container direction='row' justify='space-around'>
                            <SaveButton type='submit' disabled={this.state.name === ''} />
                            { this.props.name && 
                            <DeleteButton disabled={this.state.name === ''} onClick={this.handleDelete}/> }
                            { !this.props.hideCancel &&
                            <CancelButton  onClick={this.close} />}
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        );
    }

    get direction () {
        return this.props.direction || 'column';
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