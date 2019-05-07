import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";
import { ListSubheader, Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";


const myStyles = ({ palette, spacing }: Theme) => createStyles({
    root: {
        width: '100%',
        backgroundColor: palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: '100%',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },  
});

interface ExpenseListProps extends WithStyles<typeof myStyles>  {
    expenses: {[timestamp: number]: Expense};
    budget: Budget;
}

export const ExpenseList = withStyles(myStyles)(
    class extends React.PureComponent<ExpenseListProps> {

    private readonly dates = new Set<string>();

    render() {
        if (this.props) {
            return (
                <List className={this.props.classes.root} subheader={<li />}>
                    {this.elements}
                </List>);
        }
        return <CircularProgress/>;
    }

    get elements() {
        return this.props.expenses 
            && this.expensesArray.map(
                (expense: Expense) => 
                <li key={`section-${expense.creation.getTime()}`} className={this.props.classes.listSection}>
                    <ul className={this.props.classes.ul}>
                        <this.Subheader date={expense.when} />
                        <ExpenseListItem 
                            expense={expense}
                            budget={this.props.budget}/>
                    </ul>
                </li>);
    }

    private Subheader = (props: {date: Date}) => {
        const dateStr = props.date.toDateString();
        if (this.dates.has(dateStr)) {
            return null;
        } else {
            this.dates.add(dateStr);
            return <ListSubheader>{dateStr}</ListSubheader>
        }
    }

    get expensesArray(): Expense[] {
        return Object.values(this.props.expenses);
    }
}
);