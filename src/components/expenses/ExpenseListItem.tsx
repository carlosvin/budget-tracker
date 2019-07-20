import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Budget, Expense, Category } from "../../interfaces";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {round} from '../../utils';
import { LazyIcon } from "../../stores/IconsStore";
import { btApp } from "../../BudgetTracker";
import { Redirect } from 'react-router-dom';

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
}

interface ExpenseListItemState {
    category?: Category,
    categoryIcon: LazyIcon;
    categoryColor: string;
    redirect?: string;
}

export class ExpenseListItem extends React.PureComponent<ExpenseListItemProps, ExpenseListItemState> {
    constructor (props: ExpenseListItemProps) {
        super(props);
        this.state = {
            categoryIcon: btApp.iconsStore.defaultIcon,
            categoryColor: '#ccc'
        };
        this.fetchCategory(props.expense.categoryId);
    }

    async fetchCategory(categoryId: string){
        const category = await btApp.categoriesStore.getCategory(categoryId);
        if (category) {
            this.setState({
                category,
                categoryIcon: btApp.iconsStore.getIcon(category.icon),
                categoryColor: btApp.iconsStore.getColor(category.icon),
            });
        }
    }

    private handleClick = () => ( this.setState({...this.state, redirect: this.href }) );

    render(){
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />
        }
        return (
            <ListItem 
                divider
                button 
                onClick={ this.handleClick }
                id={this.props.expense.identifier}
                >
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
                                { this.amountBase }
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

    get amountBase () {
        return round(this.props.expense.amountBaseCurrency);
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
