import * as React from 'react';
import { categoriesStore } from '../stores/CategoriesStore';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from "@material-ui/icons/Save";
import Delete from "@material-ui/icons/Delete";
import Cancel from "@material-ui/icons/Cancel";
import { Grid } from '@material-ui/core';
import { RouterProps } from 'react-router';

export class AddCategory extends React.PureComponent<RouterProps, {name: string}> {

    private readonly store = categoriesStore;

    constructor(props: RouterProps){
        super(props);
        this.state = {name: ''};
    }

    private handleSave = () => {
        this.store.addCategory({name: this.state.name});
        this.close();
    }

    private close = () => {
        if (this.props.history.length > 1) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }
    
    render () {
        return (
            <form>
                <this.TextInput 
                    fullWidth
                    label={ 'Category Name' }
                    value={ this.state.name }
                    onChange={this.handleChange('name')}
                    style={{ margin: 8 }}
                    margin='dense' />
                <Grid container direction='row' justify='space-around'>
                    <IconButton aria-label="Save" disabled={this.state.name === ''} onClick={this.handleSave}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton aria-label="Cancel" onClick={this.close} >
                        <Cancel />
                    </IconButton>
                    <IconButton aria-label="Delete" disabled={this.state.name === ''}>
                        <Delete />
                    </IconButton>
                </Grid>                
            </form>
        );
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