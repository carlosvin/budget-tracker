import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";
import './ExpenseList.css';
import { Grid } from "@material-ui/core";

interface ExpenseListProps {
    expenses: {[timestamp: number]: Expense};
    budget: Budget;
}

export class ExpenseList extends React.PureComponent<ExpenseListProps> {
    static displayName = 'ExpenseList';

    render() {
        if (this.props) {
            return (
                <List disablePadding className='expenseListRoot'>
                    {Object.entries(this.expensesGroupedByDate)
                        .map(([date, expenses]) => 
                            <this.ListGroup key={`lg-${date}`} date={date} expenses={expenses}/>)}
                </List>);
        }
        return <CircularProgress/>;
    }

    get groups () {
        const groups = new Set<number>();
        Object.values(this.props.expenses).forEach(e => groups.add(e.when));
        return Array
            .from(groups)
            .sort((a, b) => b - a)
            .map(when => new Date(when).toDateString());
    }

    get expensesGroupedByDate () {
        // TODO improve performance: maybe by saving in correct order
        const groupedExpenses: {[k: string]: Expense[]} = {};
        for (const g of this.groups) {
            groupedExpenses[g] = [];
        }
        for (const id in this.props.expenses) {
            const expense = this.props.expenses[id];
            const kGroup = new Date(expense.when).toDateString();
            groupedExpenses[kGroup].push(expense);
        }
        return groupedExpenses;
    }

    private ListGroup = (props: {date: string, expenses: Expense[]}) => (
        <React.Fragment>
            <this.SubHeader {...props}/>
            {
                props.expenses.map((expense) => (
                    <ExpenseListItem 
                        key={`expense-${expense.identifier}`}
                        expense={expense}
                        budget={this.props.budget}/>
                ))
            }
        </React.Fragment>
    );

    private SubHeader = (props: {date: string, expenses: Expense[]}) => (
        <ListSubheader id={`date-${props.date}`}>
            <Grid container direction='row' justify='space-between'>
                <Grid item>
                    {props.date}
                </Grid>
                <Grid item>
                    {Math.round(props.expenses.map(e => this.getAmount(e)).reduce((a, b) => a + b))}
                </Grid>
            </Grid>
        </ListSubheader>
    );

    private getAmount(expense: Expense) {
        return this.props.budget.currency !== expense.currency ?
            expense.amountBaseCurrency || expense.amount : 
            expense.amount;
    }
}

ExpenseList.displayName = 'ExpenseList';
