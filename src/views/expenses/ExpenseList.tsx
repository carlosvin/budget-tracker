import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "../../components/ExpenseListItem";
import './ExpenseList.css';
import Grid from "@material-ui/core/Grid";

interface ExpenseListProps {
    expenses: {[timestamp: number]: Expense};
    budget: Budget;
    expectedDailyAvg: number;
}

interface ListGroupProps {
    date: string;
    expenses: Expense[];
    expectedDailyAvg: number;
};

export class ExpenseList extends React.PureComponent<ExpenseListProps> {
    static displayName = 'ExpenseList';

    render() {
        if (this.props) {
            return (
                <List disablePadding className='expenseListRoot'>
                    {Object.entries(this.expensesGroupedByDate)
                        .map(([date, expenses]) => 
                            <this.ListGroup 
                                key={`lg-${date}`} 
                                date={date} 
                                expenses={expenses}
                                expectedDailyAvg={this.props.expectedDailyAvg}/>)}
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

    private ListGroup = (props: ListGroupProps&{expectedDailyAvg:number}) => (
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

    private SubHeader = (props: ListGroupProps) => {
        const {date, expenses} = props;

        const sum = React.useMemo(
            () => (Math.round(
                expenses.map(
                    e => this.getAmount(e)).reduce((a, b) => a + b))), 
            [expenses]);

        const color = props.expectedDailyAvg < sum ? 'subHeaderErr' : '';

        return (<ListSubheader id={`date-${date}`}>
            <Grid container direction='row' justify='space-between' >
                <Grid item>
                    {date}
                </Grid>
                <Grid item className={color}>
                    {sum}
                </Grid>
            </Grid>
        </ListSubheader>);
    }

    private getAmount(expense: Expense) {
        // This is legacy code, because previous saved data might not have amountBaseCurrency
        if (this.props.budget.currency === expense.currency) {
            return expense.amount;
        }
        if (expense.amountBaseCurrency !== undefined) {
            return expense.amountBaseCurrency;
        }
        throw new Error('There is no amount in base currency');
    }
}

ExpenseList.displayName = 'ExpenseList';
