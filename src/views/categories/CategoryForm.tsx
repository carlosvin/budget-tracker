import * as React from 'react';
import { categoriesStore } from '../../stores/CategoriesStore';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from "@material-ui/icons/Save";
import Delete from "@material-ui/icons/Delete";
import Cancel from "@material-ui/icons/Cancel";
import Grid, { GridDirection } from '@material-ui/core/Grid';
import { RouterProps } from 'react-router';

interface CategoryFormProps extends RouterProps{
    name?: string;
    direction ?: GridDirection;
    hideCancel?: boolean;
    closeAfterSave?: boolean;
}

export class CategoryForm extends React.PureComponent<CategoryFormProps, {name: string}> {

    private readonly store = categoriesStore;

    constructor(props: CategoryFormProps){
        super(props);
        this.state = {name: props.name || ''};
    }

    private handleSave = () => {
        this.store.addCategory(this.state.name);
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
            <Grid container direction={this.direction}>
                <Grid item>
                    <this.TextInput 
                        label={ 'Category Name' }
                        value={ this.state.name }
                        onChange={this.handleChange('name')}
                        style={{ margin: 8 }}
                        margin='dense' />
                    </Grid>
                <Grid item>
                    <Grid container direction='row' justify='space-around'>
                        <IconButton aria-label="Save" disabled={this.state.name === ''} onClick={this.handleSave}>
                            <SaveIcon />
                        </IconButton>
                        { this.props.name && <IconButton aria-label="Delete" disabled={this.state.name === ''}>
                            <Delete />
                        </IconButton>}
                        { !this.props.hideCancel && <IconButton aria-label="Cancel" onClick={this.close} >
                            <Cancel />
                        </IconButton>}
                    </Grid>
                </Grid>
            </Grid> 
        );
    }

    get direction () {
        return this.props.direction || 'column';
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    }

    private TextInput = (props: TextFieldProps) => (
        <TextField
            {...props}
            id={`input-field-${props.label}`}
            label={props.label}
            value={props.value}
            onChange={this.handleChange(props.label.toString().toLowerCase())}
            style={{ margin: 8 }}
            margin='dense'
        />);
            
}