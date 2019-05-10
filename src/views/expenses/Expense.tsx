import * as React from "react";
import { TextFieldProps } from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import Grid from "@material-ui/core/Grid";
import { categoriesStore } from "../../stores/CategoriesStore";
import createStyles from "@material-ui/core/styles/createStyles";
import {WithStyles} from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Link from '@material-ui/core/Link';
import { MyLink } from "../MyLink";
import { BudgetUrl, getDateString } from "../../utils";
import { SaveButton, DeleteButton } from "../buttons";
import { AmountWithCurrencyInput } from "../AmountInput";
import { TextInput } from "../TextInput";

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
    expense: {date: string}&Expense;
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
            const now = new Date();
            this.state = {
                ...this.state, 
                expense: {
                    amount: 0, 
                    description: '', 
                    creation: now.getTime(), 
                    when: now.getTime(),
                    category: categoriesStore.getCategories()[0], 
                    currency: 'EUR',
                    date: getDateString(now)
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
                    expense: {
                        ...expense,
                        date: getDateString(new Date(expense.when))
                    }
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
                when: new Date(event.target.value).getTime(),
                date: event.target.value
            }
        });
    }

    render() {
        if (this.state && this.state.expense) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <Grid container
                        justify="space-between"
                        alignItems="baseline"
                        alignContent='stretch'>
                        <Grid item >
                            <AmountWithCurrencyInput 
                                onAmountChange={this.handleAmountChange}
                                onCurrencyChange={this.handleCurrencyChange}
                                amount={this.state.expense.amount}
                                selectedCurrency={this.state.expense.currency}
                            />
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
                    <this.Actions />
                </form>
            );
        }
        return <CircularProgress />;
    }

    private WhenInput = () => (
        <TextInput
            required
            label='When'
            type='date'
            value={ this.state.expense.date }
            InputLabelProps={{shrink: true,}}
            onChange={this.handleWhenChange}
        />
    );

    private handleCurrencyChange = (currency: string) => (
        this.setState({
            expense: {
                ...this.state.expense, 
                currency}})
    );

    private handleAmountChange = (amount: number) => (
        this.setState({
            expense: {
                ...this.state.expense, 
                amount}})
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
        <TextInput
            onChange={this.handleChange(props.label.toString().toLowerCase())}
            {...props}
        />);
            
    private Actions = () => (
        <Grid container direction='row' justify='space-evenly' alignContent='center'>
            <SaveButton type='submit'/>
            <DeleteButton onClick={this.handleDelete}/>
        </Grid>
    );

    private handleDelete = () => {
        budgetsStore.deleteExpense(
            this.state.budget.identifier, 
            this.state.expense.creation);
        this.props.history.replace(this.budgetUrl.path);
    }

    private handleSubmit = () => {
        budgetsStore.setExpense(
            this.state.budget.identifier, 
            this.state.expense as Expense);
        this.props.history.replace(this.budgetUrl.path);
    }
            
}
