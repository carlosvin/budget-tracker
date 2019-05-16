import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";

const myStyles = ({ palette }: Theme) => createStyles({
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
        static displayName = 'ExpenseList';
        private readonly dates: {[k: string]: string} = {};

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
            return this.props.expenses && this.props.budget
            && this.expensesArray.reverse().map(
                (expense: Expense) => 
                    <li key={`section-${expense.identifier}`} className={this.props.classes.listSection}>
                        <ul className={this.props.classes.ul}>
                            <this.Subheader date={new Date(expense.when)} />
                            <ExpenseListItem 
                                expense={expense}
                                budget={this.props.budget}/>
                        </ul>
                    </li>);
        }

        private Subheader = (props: {date: Date}) => {
            const dateStr = props.date.toDateString();
            if (dateStr in this.dates) {
                return null;
            } else {
                this.dates[dateStr] = dateStr;
                return <ListSubheader>{dateStr}</ListSubheader>
            }
        }

        get expensesArray(): Expense[] {
            return Object.values(this.props.expenses);
        }
    }
);

ExpenseList.displayName = 'ExpenseList';
