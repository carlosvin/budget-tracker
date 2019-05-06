import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";

interface ExpenseListProps {
    expenses: {[timestamp: number]: Expense};
    budget: Budget;
}

export class ExpenseList extends React.PureComponent<ExpenseListProps> {

    render() {
        if (this.props) {
            return (
                <List>
                    {this.elements}
                </List>);
        }
        return <CircularProgress/>;
    }

    get elements() {
        return this.props.expenses 
            && this.expensesArray.map(
                (expense: Expense) => <ExpenseListItem 
                    key={expense.timestamp} 
                    expense={expense} 
                    budget={this.props.budget}/>);
    }

    get expensesArray(): Expense[] {
        return Object.values(this.props.expenses);
    }
}
