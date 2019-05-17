import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";

interface ExpenseListProps {
    expenses: {[timestamp: number]: Expense};
    budget: Budget;
}

export class ExpenseList extends React.PureComponent<ExpenseListProps> {
        static displayName = 'ExpenseList';
        private readonly dates: {[k: string]: string} = {};

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
            return this.props.expenses && this.props.budget
            && this.expensesArray.reverse().map(
                (expense: Expense) => 
                    <React.Fragment key={`exp-elem-${expense.identifier}`}>
                        <this.Subheader date={new Date(expense.when)} />
                        <ExpenseListItem 
                            expense={expense}
                            budget={this.props.budget}/>
                    </React.Fragment>);
        }

        private Subheader = (props: {date: Date}) => {
            const dateStr = props.date.toDateString();
            if (dateStr in this.dates) {
                return null;
            } else {
                this.dates[dateStr] = dateStr;
                return <ListSubheader >{dateStr}</ListSubheader>
            }
        }

        get expensesArray(): Expense[] {
            return Object.values(this.props.expenses);
        }
    }


ExpenseList.displayName = 'ExpenseList';
