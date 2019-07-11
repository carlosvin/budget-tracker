import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Budget, Expense, Category } from "../interfaces";
import { MyLink } from "./MyLink";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {round, stringToColorCss} from '../utils';
import { LazyIcon } from "../stores/IconsStore";
import { btApp } from "../BudgetTracker";

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
}

interface ExpenseListItemState {
    category?: Category,
    categoryIcon: LazyIcon;
    categoryColor: string;
}

export class ExpenseListItem extends React.PureComponent<ExpenseListItemProps, ExpenseListItemState> {
    constructor (props: ExpenseListItemProps) {
        super(props);
        this.state = {
            categoryIcon: btApp.iconsStore.defaultIcon,
            categoryColor: stringToColorCss('')
        };
        this.fetchCategory(props.expense.categoryId);
    }

    async fetchCategory(categoryId: string){
        const category = await btApp.categoriesStore.getCategory(categoryId);
        if (category) {
            const icon = btApp.iconsStore.getIcon(category.icon);
            this.setState({
                category,
                categoryIcon: icon,
                categoryColor: stringToColorCss(category.icon),
            });
    
        }
    }

    render(){
        return (
            <ListItem 
                divider
                button 
                component={MyLink}
                href={this.href}>
                <ListItemAvatar >
                    <React.Suspense fallback={'icon'}>
                        <this.state.categoryIcon style={{color: this.state.categoryColor}}/>
                    </React.Suspense>
                </ListItemAvatar>
                <ListItemText 
                    primary={this.state.category && this.state.category.name} 
                    secondary={this.props.expense.description}
                />
                <ListItemSecondaryAction>
                    <ListItemText>
                        <Grid container 
                            direction='column' 
                            alignItems='flex-end' 
                            justify='flex-end'>
                            <Typography variant="body1">
                                { this.primaryAmount }
                            </Typography>
                            { !this.isBaseCurrency && 
                                <Typography variant="body2" color="textSecondary">
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

    get href () {
        return `/budgets/${this.props.budget.identifier}/expenses/${this.props.expense.identifier}`;
    }
}
