import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Budget, Expense, Category } from "../../interfaces";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { btApp } from "../../BudgetTracker";
import { Redirect } from 'react-router-dom';
import { round } from "../../domain/utils/round";
import { ExpenseUrl } from "../../domain/ExpenseUrl";

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = (props) => {

    const [category, setCategory] = React.useState<Category>();
    const [CategoryIcon, setCategoryIcon] = React.useState();
    const [categoryColor, setCategoryColor] = React.useState('#ccc');
    const [redirect, setRedirect] = React.useState();

    const {expense, budget} = props;
    const {categoryId} = expense;
    const expenseUrl = new ExpenseUrl(props.budget.identifier, props.expense.identifier);

    React.useEffect(
        () => {
            async function fetchCategory(categoryId: string){
                const store = await btApp.getCategoriesStore();
                const categoryObj = await store.getCategory(categoryId);
                if (categoryObj) {
                    const iconsStore = await btApp.getIconsStore();
                    setCategory(categoryObj);
                    setCategoryColor(iconsStore.getColor(categoryObj.icon));
                    setCategoryIcon(iconsStore.getIcon(categoryObj.icon));
                }
            }
            fetchCategory(categoryId);
        },
        [categoryId]    
    );

    function amountBase () {
        return round(expense.amountBaseCurrency);
    }

    function amount () {
        return `${round(expense.amount)} ${expense.currency}`;
    }

    function isBaseCurrency () {
        return budget.currency === expense.currency;
    }

    const handleClick = () => ( setRedirect(expenseUrl.path) );

    if (redirect) {
        return <Redirect push to={redirect} />
    }

    return (
        <ListItem 
            divider
            button 
            onClick={ handleClick }
            id={expense.identifier}
            >
            <ListItemAvatar >
                <React.Suspense fallback={'icon'}>
                    { CategoryIcon && <CategoryIcon style={{color: categoryColor}}/> }
                </React.Suspense>
            </ListItemAvatar>
            <ListItemText 
                primary={category && category.name} 
                secondary={expense.description}
            />
            <ListItemSecondaryAction>
                <ListItemText>
                    <Grid container 
                        direction='column' 
                        alignItems='flex-end' 
                        justify='flex-end'>
                        <Typography variant="body1">
                            { amountBase() }
                        </Typography>
                        { !isBaseCurrency() && 
                            <Typography variant="body2" color="textSecondary">
                                {amount()}
                            </Typography> 
                        }
                    </Grid>
                </ListItemText>  
            </ListItemSecondaryAction>
        </ListItem>
    );
}
