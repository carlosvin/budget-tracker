import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Budget, Expense, CategoriesMap } from "../../api";
import { Redirect } from 'react-router-dom';
import { ExpensePath } from "../../domain/paths/ExpensePath";
import CategoryIcon from "../categories/CategoryIcon";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { getCurrencyWithSymbol } from "../../domain/utils/getCurrencyWithSymbol";
import Avatar from "@material-ui/core/Avatar";

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
    categories: CategoriesMap;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = (props) => {
    const {expense, budget, categories} = props;
    const {categoryId} = expense;
    const expenseUrl = new ExpensePath(
        props.expense.identifier, 
        new BudgetPath(props.budget.identifier));

    const [redirect, setRedirect] = React.useState();

    function amountBase () {
        return expense.amountBaseCurrency.toLocaleString();
    }

    function amount () {
        return getCurrencyWithSymbol(expense.amount, expense.currency);
    }

    function isBaseCurrency () {
        return budget.currency === expense.currency;
    }

    const handleClick = () => ( setRedirect(expenseUrl.path) );

    const category = React.useMemo(() => (categories[categoryId]), [categoryId, categories]);

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
                    <Avatar style={{backgroundColor:'#eee'}}>
                        <CategoryIcon name={category.icon}/>
                    </Avatar> 
                </ListItemAvatar> }
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
