import * as React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense, Category } from "../interfaces";
import { budgetsStore } from "../stores/BudgetsStore";
import { currenciesStore } from "../stores/CurrenciesStore";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/AddBoxRounded";
import SaveIcon from "@material-ui/icons/Save";
import { categoriesStore } from "../stores/CategoriesStore";

interface ExpenseViewProps extends RouteComponentProps<{ id: string; timestamp: string }> { }

interface ExpenseViewState {
    expense: Partial<Expense>;
    budget: Budget;
    currencies: string[];
}

export class ExpenseView extends React.PureComponent<ExpenseViewProps, ExpenseViewState> {

    private readonly categories: string[];

    constructor(props: ExpenseViewProps) {
        super(props);
        this.initBudget(props.match.params.id);
        this.initExpense(
            props.match.params.id,
            +props.match.params.timestamp);
        this.initCurrencies();
        this.categories = categoriesStore.getCategories().map(c => c.name);
    }

    private async initCurrencies() {
        try {
            const currencies = await currenciesStore.getCurrencies();
            if (currencies) {
                this.setState({
                    ...this.state,
                    currencies
                });
            }
        } catch (e) {
            console.trace(e);
        }
    }

    private async initExpense(identifier: string, timestamp: number) {
        try {
            const expense = await budgetsStore.getExpense(identifier, timestamp);
            if (expense) {
                this.setState({
                    ...this.state,
                    expense
                });
            }
        } catch (e) {
            console.trace(e);
        }
    }

    private async initBudget(identifier: string) {
        try {
            const budget = await budgetsStore.getBudget(identifier);
            if (budget) {
                this.setState({
                    ...this.state,
                    budget
                });
            }
        } catch (e) {
            console.trace(e);
        }
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            expense: {
                ...this.state.expense,
                [name]: event.target.value
            }
        });
    }

    render() {
        if (this.state && this.state.expense) {
            return (
                <form noValidate autoComplete="off">
                    <this.AmountInput />
                    <this.CategoryInput categories={this.categories} />
                    <this.TextInput label='Description' value={this.state.expense.description} />
                    <this.Actions />
                </form>
            );
        }
        return <CircularProgress />;
    }

    private AmountInput = () => (
        <Grid container spacing={8}>
                    <Grid item xl>

            <this.TextInput
                required
                type='number'
                label="Amount"
                value={this.state.expense.amount}
            />
            </Grid>
            <Grid item xs>
            {this.state.currencies
                && <this.CurrencyInput currencies={this.state.currencies} />}
        </Grid></Grid>
    );

    private CategoryInput = (props: { categories: string[] }) => (
        <Grid container spacing={8}>
            <Grid item xl>
                <this.SelectBox
                    options={props.categories}
                    label='Category'
                    value={this.state.expense.category}
                />
            </Grid>
            <Grid item xs>
                <IconButton aria-label="Add category" >
                    <AddIcon />
                </IconButton>                
            </Grid>
        </Grid>
    );
            
    private CurrencyInput = (props: {currencies: string[]}) => (
        <this.SelectBox
                    options={props.currencies}
                    label='Currency'
                    value={this.state.expense.currency || this.state.budget.currency}
                />
                );
            
    private SelectBox = (props: {options: string[]; label: string; value: string }) => (
        <this.TextInput
                    select
                    required
                    SelectProps={{ native: true }}
                    label={props.label}
                    value={props.value}
                >
                    {props.options.map(
                        (opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>))}
                </this.TextInput>
                );
            
                private TextInput = (props: TextFieldProps) => (
        <TextField
                    {...props}
                    id={`input-field-${props.label}`}
                    label={props.label}
                    value={props.value}
                    onChange={this.handleChange(props.label.toString().toLowerCase())}
                    style={{ margin: 10 }}
                />
                );
            
                private Actions = () => (
        <Grid container direction="row">
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="Save">
                        <SaveIcon />
                    </IconButton>
                </Grid>
                );
            
            }
