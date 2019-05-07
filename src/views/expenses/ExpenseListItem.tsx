import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { Budget, Expense } from "../../interfaces";
import { MyLink } from "../MyLink";


interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
}

export class ExpenseListItem extends React.PureComponent<ExpenseListItemProps> {
    
    render(){
        return (
        <ListItem 
            divider
            button 
            component={MyLink}
            href={this.href}>
            <Avatar>
                <BeachAccessIcon />
            </Avatar>
            <ListItemText 
                primary={this.props.expense.description} 
                secondary={this.props.expense.amount}
            />
        </ListItem>);
    }

    get href () {
        return `/budgets/${this.props.budget.identifier}/expenses/${this.props.expense.creation}`;
    }

    get amount () {
        return `${this.props.expense.amount} ${this.props.expense.currency} - XX EUR`;
    }
}
