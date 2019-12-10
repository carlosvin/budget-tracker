import * as React from "react";
import List from '@material-ui/core/List';
import { Budget, Expense, CategoriesMap } from "../../api";
import { ExpensesListGroup } from "./ExpenseListGroup";
import Typography from "@material-ui/core/Typography";
import { useLocalization } from "../../hooks/useLocalization";

interface ExpenseListProps {
    budget: Budget;
    expensesByGroup: Map<string, Map<string, Expense>>;
    categories: CategoriesMap;
}

export const ExpenseList: React.FC<ExpenseListProps> = (props) => {
    const loc = useLocalization();

    if (props.expensesByGroup.size > 0) {
        return <List style={{
            height: '100%',
            backgroundColor: '#fff',
            position: 'relative',
            overflow: 'auto',
            listStyleType: 'none'
        }}>
            {[...props.expensesByGroup.entries()]
                .map(([group, expenses]) => (
                    <ExpensesListGroup
                        key={`lg-${group}`}
                        name={group}
                        budget={props.budget}
                        expenses={expenses.values()}
                        categories={props.categories} />)
                )}
        </List>;
    } else {
        return <Typography>{loc.get('No expenses')}</Typography>;
    }


}
