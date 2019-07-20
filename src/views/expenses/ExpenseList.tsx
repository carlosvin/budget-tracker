import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Budget, ExpensesYearMap } from "../../interfaces";
import './ExpenseList.css';
import { ExpensesListGroup } from "../../components/expenses/ExpenseListGroup";

interface ExpenseListProps {
    budget: Budget;
    expensesByDate: ExpensesYearMap;
    expectedDailyAvg: number;
}
export class ExpenseList extends React.PureComponent<ExpenseListProps> {

    render() {
        if (this.props) {
            return (
                <List disablePadding className='expenseListRoot'>
                    {Object.entries(this.props.expensesByDate)
                        .map(([date, expenses]) => 
                            <ExpensesListGroup
                                key={`lg-${date}`} 
                                date={new Date(parseInt(date))} 
                                budget={this.props.budget}
                                expenses={Object.values(expenses)}
                                expectedDailyAvg={this.props.expectedDailyAvg}/>)}
                </List>);
        }
        return <CircularProgress/>;
    }

}
