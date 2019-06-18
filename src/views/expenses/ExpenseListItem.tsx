import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Budget, Expense } from "../../interfaces";
import { MyLink } from "../../components/MyLink";
import { categoriesStore } from "../../stores/CategoriesStore";
import { iconsStore } from "../../stores/IconsStore";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {round, stringToColorCss} from '../../utils';

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
}

export class ExpenseListItem extends React.PureComponent<ExpenseListItemProps> {
    
    render(){
        const category = this.getCategory();
        return (
            <ListItem 
                divider
                button 
                component={MyLink}
                href={this.href}>
                <ListItemAvatar >
                    <React.Suspense fallback={'icon'}>
                        <this.Icon style={{color: `${stringToColorCss(category ? category.icon : '')}`}}/>
                    </React.Suspense>
                </ListItemAvatar>
                <ListItemText 
                    primary={this.categoryName} 
                    secondary={this.props.expense.description}
                />
                <ListItemSecondaryAction>
                    <ListItemText>
                        <Grid container 
                            direction='column' 
                            alignItems='flex-end' 
                            justify='flex-end'>
                            <Typography variant="subtitle1">
                                { this.primaryAmount }
                            </Typography>
                            { !this.isBaseCurrency && 
                                <Typography variant="body1" color="textSecondary">
                                    {this.amount}
                                </Typography> 
                            }
                        </Grid>
                    </ListItemText>  
                </ListItemSecondaryAction>
            </ListItem>);
    }

    get primaryAmount () {
        // TODO if we always save base amount, we can save this condition
        return this.isBaseCurrency ? this.props.expense.amount : this.amountBase;
    }

    get amountBase () {
        return this.props.expense.amountBaseCurrency && round(this.props.expense.amountBaseCurrency);
    }

    get amount () {
        return `${round(this.props.expense.amount)} ${this.props.expense.currency}`;
    }

    get isBaseCurrency () {
        return this.props.budget.currency === this.props.expense.currency;
    }

    get Icon () {
        const c = this.getCategory();
        return c ? iconsStore.getIcon(c.icon) : iconsStore.defaultIcon;
    }

    get categoryName () {
        const c = this.getCategory();
        return c && c.name;
    }

    getCategory () {
        return categoriesStore.getCategory(this.props.expense.categoryId);
    }

    get href () {
        return `/budgets/${this.props.budget.identifier}/expenses/${this.props.expense.identifier}`;
    }
}
