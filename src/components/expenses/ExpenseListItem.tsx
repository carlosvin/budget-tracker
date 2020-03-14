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
import { Link } from "../Link";

interface ExpenseListItemProps {
    budget: Budget;
    expense: Expense;
    categories: CategoriesMap;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = (props) => {
    const {expense, budget, categories} = props;
    const {categoryId, identifier} = expense;
    const budgetPath = new BudgetPath(props.budget.identifier);
    const expensePath = new ExpensePath(identifier, budgetPath);

    const [redirect, setRedirect] = React.useState<string>();

    function amountBase () {
        return expense.amountBaseCurrency.toLocaleString();
    }

    function amount () {
        return getCurrencyWithSymbol(expense.amount, expense.currency);
    }

    function isBaseCurrency () {
        return budget.currency === expense.currency;
    }

    const handleClick = () => ( setRedirect(expensePath.path) );

    const category = React.useMemo(() => (categories[categoryId]), [categoryId, categories]);

    if (redirect) {
        return <Redirect push to={redirect} />
    }

    return (
        <ListItem divider button onClick={ handleClick } id={identifier}
            >
            { category && <ListItemAvatar>
                    <Avatar style={{backgroundColor:'#eee'}}>
                        <CategoryIcon name={category.icon}/>
                    </Avatar> 
                </ListItemAvatar> }
            <ListItemText 
                primary={
                    category && <Link to={budgetPath.pathExpensesByCategory(category.identifier)}>{category.name}</Link>} 
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
