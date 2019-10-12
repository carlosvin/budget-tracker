import * as React from "react";
import List from '@material-ui/core/List';
import { Budget, Expense } from "../../api";
import { ExpensesListGroup } from "./ExpenseListGroup";

interface ExpenseListProps {
    budget: Budget;
    expensesByGroup: Map<string, Map<string, Expense>>;
}

export const ExpenseList: React.FC<ExpenseListProps> = (props) => (
    <List style={{
        height: '100%', 
        backgroundColor: '#fff', 
        position: 'relative', 
        overflow: 'auto', 
        listStyleType: 'none'}}>
        {[...props.expensesByGroup.entries()]
            .map(([group, expenses]) => (
                <ExpensesListGroup
                key={`lg-${group}`} 
                name={group}
                budget={props.budget}
                expenses={expenses.values()}/>)
        )}
    </List>
);
