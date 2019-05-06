import * as React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import { currenciesStore } from "../../stores/CurrenciesStore";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import { categoriesStore } from "../../stores/CategoriesStore";
import { WithStyles, createStyles, Theme, Link } from '@material-ui/core';
import { MyLink } from "../MyLink";
import { TODAY_STRING, BudgetUrl } from "../../utils";

const myStyles = ({ palette, spacing }: Theme) => createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: spacing.unit * 2,
      textAlign: 'center',
      color: palette.text.secondary,
    },
});

interface ExpenseViewProps extends 
    RouteComponentProps<{ id: string; timestamp: string }>,
    WithStyles<typeof myStyles>  { }

interface ExpenseViewState {
    expense: Partial<Expense>;
    budget: Budget;
    currencies: string[];
}

export class ExpenseView extends React.PureComponent<ExpenseViewProps, ExpenseViewState> {

    private readonly budgetUrl: BudgetUrl;

    constructor(props: ExpenseViewProps) {
        super(props);
        this.budgetUrl = new BudgetUrl(props.match.params.id);
        this.initBudget(props.match.params.id);
        this.initCurrencies();
        if (props.match.params.timestamp) {
            this.initExpense(
                props.match.params.id,
                +props.match.params.timestamp);    
        } else {
            this.state = {...this.state, expense: {amount: 0, description: ''}};
        }
    }

    private get categories () {
        return categoriesStore.getCategories();
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
                <React.Fragment>
                    <form >
                        <Grid container
                            justify="space-between"
                            alignItems="baseline"
                            alignContent='stretch'>
                            <Grid item >
                                <this.AmountInput />
                            </Grid>
                            <Grid item >
                                <this.CategoryInput categories={this.categories} />
                            </Grid>
                            <Grid item>
                                <this.TextInput
                                    required
                                    label='When'
                                    type='date'
                                    defaultValue={ TODAY_STRING }
                                    InputLabelProps={{shrink: true,}}
                                />
                            </Grid>
                            <Grid item >
                                <this.TextInput label='Description' value={this.state.expense.description} />
                            </Grid>
                        </Grid>
                    </form>
                    <this.Actions />
                </React.Fragment>
            );
        }
        return <CircularProgress />;
    }

    private AmountInput = () => (
        <Grid container direction='row'>
            <Grid item >
                <this.TextInput
                    autoFocus
                    required
                    type='number'
                    label='Amount'
                    value={this.state.expense.amount}
                />
            </Grid>
            <Grid item >
                {this.state.currencies
                    && <this.CurrencyInput currencies={this.state.currencies} />}
            </Grid>
        </Grid>
    );

    private CategoryInput = (props: { categories: string[] }) => (
        <this.SelectBox
            options={props.categories}
            label='Category'
            value={this.state.expense.category}
            helperText={<Link href='/categories/add' component={MyLink}>Add category</Link>}
        />
    );
            
    private CurrencyInput = (props: {currencies: string[]}) => (
        <this.SelectBox
            options={props.currencies}
            label='Currency'
            value={this.state.expense.currency || (this.state.budget && this.state.budget.currency) || 'USD'}
        />);
            
    private SelectBox = (props: TextFieldProps&{options: string[]}) => (
        <this.TextInput
            {...props}
            select
            required 
            SelectProps={{ native: true }} >
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
            style={{ margin: 8 }}
            margin='dense'            
        />);
            
    private Actions = () => (
        <Grid container direction='row' justify='space-evenly' alignContent='center'>
            <IconButton aria-label='Save' onClick={this.handleSave}>
                <SaveIcon />
            </IconButton>
            <IconButton aria-label='Delete' onClick={this.handleDelete}>
                <DeleteIcon />
            </IconButton>
        </Grid>);

    private handleDelete = () => {
        budgetsStore.deleteExpense(
            this.state.budget.identifier, 
            this.state.expense.timestamp);
        this.props.history.replace(this.budgetUrl.path);
    }

    private handleSave = () => {
        budgetsStore.saveExpense(
            this.state.budget.identifier, 
            this.state.expense as Expense);
        this.props.history.replace(this.budgetUrl.path);
    }
            
}
