import * as React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import { categoriesStore } from "../../stores/CategoriesStore";
import { WithStyles, createStyles, Theme, Link } from '@material-ui/core';
import { MyLink } from "../MyLink";
import { TODAY_STRING, BudgetUrl, getDateString } from "../../utils";
import { CurrencyInput } from "../CurrencyInput";

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
        if (props.match.params.timestamp) {
            this.initExpense(
                props.match.params.id,
                +props.match.params.timestamp);    
        } else {
            this.state = {
                ...this.state, 
                expense: {
                    amount: 0, 
                    description: '', 
                    creation: new Date(), 
                    when: new Date(),
                    category: categoriesStore.getCategories()[0]
                }};
        }
    }

    private get isAddView(){
        return this.props.match.params.timestamp === undefined;
    }

    private get categories () {
        return categoriesStore.getCategories();
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
                const state = {
                    ...this.state,
                    budget
                };
                if (this.isAddView) {
                    state.expense.currency = budget.currency;
                }
                this.setState(state);
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

    handleWhenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            expense: {
                ...this.state.expense,
                when: new Date(event.target.value)
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
                                <this.WhenInput />
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

    private get date(){
        return getDateString(this.state.expense.when);
    }

    private WhenInput = () => (
        <TextField
            required
            label='When'
            type='date'
            value={ this.date }
            InputLabelProps={{shrink: true,}}
            id={'input-field-date'}
            onChange={this.handleWhenChange}
            style={{ margin: 8 }}
            margin='dense'  
        />
    );

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
                <CurrencyInput onCurrencyChange={this.handleCurrencyChange} />
            </Grid>
        </Grid>
    );

    private handleCurrencyChange = (currency: string) => (
        this.setState({
            expense: {
                ...this.state.expense, 
                currency}})
    );

    private CategoryInput = (props: { categories: string[] }) => (
        <this.SelectBox
            options={props.categories}
            label='Category'
            value={this.state.expense.category}
            helperText={<Link href='/categories/add' component={MyLink}>Add category</Link>}
        />
    );
            
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
            this.state.expense.creation.getTime());
        this.props.history.replace(this.budgetUrl.path);
    }

    private handleSave = () => {
        budgetsStore.saveExpense(
            this.state.budget.identifier, 
            this.state.expense as Expense);
        this.props.history.replace(this.budgetUrl.path);
    }
            
}
