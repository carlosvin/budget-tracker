import * as React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../interfaces";
import { budgetsStore } from "../BudgetsStore";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";

const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];


const categories = [
    {
        value: 'General',
        label: 'General',
    },
    {
        value: 'Exchange',
        label: 'Exchange',
    }
];


interface ExpenseViewProps extends RouteComponentProps<{ id: string, timestamp: string }> { }

interface ExpenseViewState {
    expense: Partial<Expense>;
    budget: Budget;
}

export class ExpenseView extends React.PureComponent<ExpenseViewProps, ExpenseViewState> {

    constructor(props: ExpenseViewProps) {
        super(props);
        this.initBudget(props.match.params.id);
        this.initExpense(
            props.match.params.id,
            +props.match.params.timestamp);
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
            console.error(e);
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
            console.error(e);
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
                    <TextField
                        id="description"
                        label="Description"
                        value={this.state.expense.description}
                        onChange={this.handleChange('description')}
                    />
                    <TextField
                        id="standard-select-category"
                        select
                        label="Category"
                        value={this.state.expense.category}
                        onChange={this.handleChange('category')}
                        SelectProps={{ native: true }}
                    // helperText="Please select a category"
                    >
                        {categories.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        type="number"
                        id="amount"
                        label="Amount"
                        value={this.state.expense.amount}
                        onChange={this.handleChange('amount')}
                    />
                    <TextField
                        id="standard-select-currency-native"
                        select
                        label="Currency"
                        value={this.state.expense.currency || this.state.budget.currency}
                        onChange={this.handleChange('currency')}
                        SelectProps={{ native: true }}
                    //helperText="Please select your currency"
                    >
                        {currencies.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="Save">
                        <SaveIcon />
                    </IconButton>
                </form>


            );
        }
        return <CircularProgress />;

    }
}