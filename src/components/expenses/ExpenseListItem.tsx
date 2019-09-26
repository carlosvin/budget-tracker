import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Budget, Expense } from "../../interfaces";
import { Redirect } from 'react-router-dom';
import { round } from "../../domain/utils/round";
import { ExpensePath } from "../../domain/paths/ExpensePath";
import { useCategory } from "../../hooks/useCategory";
import CategoryIcon from "../categories/CategoryIcon";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { getCurrencyWithSymbol } from "../../domain/utils/getCurrencyWithSymbol";

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = (props) => {
    const {expense, budget} = props;
    const {categoryId} = expense;
    const expenseUrl = new ExpensePath(props.expense.identifier, new BudgetPath(props.budget.identifier));

    const category = useCategory(categoryId);

    const [redirect, setRedirect] = React.useState();

    function amountBase () {
        return round(expense.amountBaseCurrency);
    }

    function amount () {
        return getCurrencyWithSymbol(round(expense.amount), expense.currency);
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
            { category && <ListItemAvatar>
                    <CategoryIcon name={category.icon}/> 
                </ListItemAvatar> 
            }
            <ListItemText 
                primary={category && category.name} 
                secondary={expense.description}
                secondaryTypographyProps={{ noWrap: true }}
            />
            <ListItemText 
                style={{textAlign: 'right'}}
                primary={amountBase()} 
                secondary={!isBaseCurrency() && amount()}
            />
        </ListItem>
    );
}
