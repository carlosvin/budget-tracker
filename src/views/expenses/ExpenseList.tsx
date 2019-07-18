import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Expense, Budget, ExpensesGroups } from "../../interfaces";
import { ExpenseListItem } from "../../components/ExpenseListItem";
import './ExpenseList.css';
import Grid from "@material-ui/core/Grid";

interface ExpenseListProps {
    budget: Budget;
    expensesByDate: ExpensesGroups;
    expectedDailyAvg: number;
}

interface ListGroupProps {
    budget: Budget;
    date: string;
    expenses: Expense[];
    expectedDailyAvg: number;
}

const SubHeader: React.FC<ListGroupProps> = (props) => {
    const {date, expenses, budget} = props;
    const {currency} = budget;

    const sum = React.useMemo(
        () => (Math.round(
            expenses.map(
                e => getAmount(e, currency)).reduce((a, b) => a + b))), 
        [expenses, currency]);

    const color = props.expectedDailyAvg < sum ? 'subHeaderErr' : '';

    return (
        <ListSubheader id={`date-${date}`}>
            <Grid container direction='row' justify='space-between' >
                <Grid item>
                    {new Date(parseInt(date)).toDateString()}
                </Grid>
                <Grid item className={color}>
                    {sum}
                </Grid>
            </Grid>
        </ListSubheader>);
}

function getAmount(expense: Expense, baseCurrency: string) {
    // This is legacy code, because previous saved data might not have amountBaseCurrency
    if (baseCurrency === expense.currency) {
        return expense.amount;
    }
    if (expense.amountBaseCurrency !== undefined) {
        return expense.amountBaseCurrency;
    }
    throw new Error('There is no amount in base currency');
}

const ListGroup: React.FC<ListGroupProps&{expectedDailyAvg:number}> = (props) => (
    <React.Fragment>
        <SubHeader {...props}/>
        {
            props.expenses.map((expense) => (
                <ExpenseListItem 
                    key={`expense-${expense.identifier}`}
                    expense={expense}
                    budget={props.budget}/>
            ))
        }
    </React.Fragment>
);

export class ExpenseList extends React.PureComponent<ExpenseListProps> {

    render() {
        if (this.props) {
            return (
                <List disablePadding className='expenseListRoot'>
                    {Object.entries(this.props.expensesByDate)
                        .map(([date, expenses]) => 
                            <ListGroup 
                                key={`lg-${date}`} 
                                date={date} 
                                budget={this.props.budget}
                                expenses={Object.values(expenses)}
                                expectedDailyAvg={this.props.expectedDailyAvg}/>)}
                </List>);
        }
        return <CircularProgress/>;
    }

}
