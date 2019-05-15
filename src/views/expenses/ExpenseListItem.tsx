import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import { Budget, Expense } from "../../interfaces";
import { MyLink } from "../MyLink";
import { getIcon } from "../categories/icons";
import { categoriesStore } from "../../stores/CategoriesStore";


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
                    <React.Suspense fallback={'icon'}>
                        <this.Icon />
                    </React.Suspense>
                </Avatar>
                <ListItemText 
                    primary={this.props.expense.description} 
                    secondary={this.props.expense.amount}
                />
            </ListItem>);
    }

    get Icon (){
        return getIcon(this.props.expense.categoryId);
    }

    get category () {
        return categoriesStore.getCategory(this.props.expense.categoryId);
    }

    get href () {
        return `/budgets/${this.props.budget.identifier}/expenses/${this.props.expense.identifier}`;
    }

    get amount () {
        return `${this.props.expense.amount} ${this.props.expense.currency} - XX EUR`;
    }
}
