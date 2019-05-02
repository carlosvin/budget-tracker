import * as React from "react";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense, Category } from "../interfaces";
import { budgetsStore } from "../stores/BudgetsStore";
import { currenciesStore } from "../stores/CurrenciesStore";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import { categoriesStore } from "../stores/CategoriesStore";

interface ExpenseViewProps extends RouteComponentProps<{ id: string, timestamp: string }> { }

interface ExpenseViewState {
    expense: Partial<Expense>;
    budget: Budget;
    currencies: string[];
}

export class ExpenseView extends React.PureComponent<ExpenseViewProps, ExpenseViewState> {

    constructor(props: ExpenseViewProps) {
        super(props);
        this.initBudget(props.match.params.id);
        this.initExpense(
            props.match.params.id,
            +props.match.params.timestamp);
        this.initCurrencies();

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
        const cats = categoriesStore.getCategories();
        if (this.state && this.state.expense) {
            return (
                <form noValidate autoComplete="off">
                    <TextField
                        id="text-field-description"
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
                    >
                        { categoriesStore.getCategories()
                            .map((c: Category) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
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
                    {this.state.currencies &&
                    <TextField
                        id="standard-select-currency-native"
                        select
                        label="Currency"
                        value={this.state.expense.currency || this.state.budget.currency}
                        onChange={this.handleChange('currency')}
                        SelectProps={{ native: true }}
                    >
                        { this.state.currencies.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                    }
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