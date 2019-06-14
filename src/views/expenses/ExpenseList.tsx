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

    get expensesGroupedByDate () {
        const group: {[k: string]: Expense[]} = {};
        for (const ts in this.props.expenses) {
            const expense = this.props.expenses[ts];
            const kGroup = new Date(expense.when).toDateString();
            if (!(kGroup in group)) {
                group[kGroup] = [];
            }
            group[kGroup].push(expense);
        }
        return group;
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
                    {Math.round(props.expenses.map(e => e.amountBaseCurrency || e.amount).reduce((a, b) => a + b))}
                </Grid>
            </Grid>

        </ListSubheader>
    );
}

ExpenseList.displayName = 'ExpenseList';
