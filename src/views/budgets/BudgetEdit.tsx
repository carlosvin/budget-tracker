import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { BudgetUrl, getDateString, goBack } from "../../utils";
import { currenciesStore } from "../../stores/CurrenciesStore";
import { Grid } from "@material-ui/core";
import { CurrencyInput } from "../CurrencyInput";
import { SaveButton, CancelButton } from "../buttons";
const uuid = require('uuid/v1');

interface BudgetEditProps extends RouteComponentProps<{ id: string }>{}

interface BudgetViewState extends Budget {}

export class BudgetEdit extends React.PureComponent<BudgetEditProps, BudgetViewState> {
    
    private readonly url: BudgetUrl;
    
    constructor(props: BudgetEditProps){
        super(props);
        if (props.match.params.id) {
            this.initBudget(props.match.params.id);
            this.url = new BudgetUrl(props.match.params.id);
        } else {
            this.state = {
                currency: currenciesStore.base,
                from: new Date(),
                to: new Date(),
                identifier: uuid(),
                name: '',
                total: 0 
            };
            this.url = new BudgetUrl(this.state.identifier);
        }
    }

    private async initBudget(identifier: string) {
        try {
            const info = await budgetsStore.getBudget(identifier);
            if (info) {
                this.setState({ ...info });
            }
        } catch (e) {
            console.error(e);
        }
    }

    // TODO unify handling using type as argument. I have to research how to do it in TS
    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            [name]: event.target.value
        });
    }

    handleDateChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            [name]: new Date(event.target.value)
        });
    }

    private TextInput = (props: TextFieldProps) => {
        const propertyName = props.label.toString().toLowerCase();
        const handler = props.type === 'date' ? 
            this.handleDateChange(propertyName) : 
            this.handleChange(propertyName);
        return (
            <TextField
                {...props}
                id={`input-field-${props.label}`}
                label={props.label}
                value={props.value}
                onChange={handler}
                style={{ margin: 8 }}
                margin='dense'
                required      
            />
        );
    }

    private handleSave = () => {
        budgetsStore.setBudget(this.state);
        this.props.history.replace(this.url.path);
    }

    private close = () => {
        goBack(this.props.history);
    }

    private Actions = () => (
        <Grid container direction='row' justify='space-evenly'>
            <SaveButton onClick={this.handleSave} />
            <CancelButton onClick={this.close} />
        </Grid>
    );

    render() {
        if (this.state) {
            return (
                <form>
                    <this.TextInput label='Name' value={this.state.name} />
                    <this.TextInput label='From' value={this.from} type='date'/>
                    <this.TextInput label='To' value={this.to} type='date'/>
                    <this.TextInput label='Total' value={this.state.total} type='number'/>
                    <CurrencyInput onCurrencyChange={this.handleCurrencyChange}  />
                    <this.Actions />
                </form>
            );
        }
        return <CircularProgress/>;
    }


    private handleCurrencyChange = (currency: string) => (
        this.setState({ currency })
    );

    private get from(){
        return getDateString(this.state.from);
    }

    private get to(){
        return getDateString(this.state.to);
    }
}
