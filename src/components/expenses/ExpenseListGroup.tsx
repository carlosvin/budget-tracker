import * as React from "react";
import { Expense, Budget, CategoriesMap } from "../../api";
import { ExpenseListItem } from "./ExpenseListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

interface ExpensesListGroupProps {
    budget: Budget;
    expenses: Iterable<Expense>;
    name: string;
    categories: CategoriesMap;
}

export const ExpensesListGroup: React.FC<ExpensesListGroupProps> = (props) => (
    <React.Fragment>
        <ListSubheader 
            component='div' 
            id={`subheader-${props.name}`} >
            { props.name }
        </ListSubheader>
        {
            Array.from(props.expenses).map((expense) => (
                <ExpenseListItem 
                    key={`expense-${expense.identifier}`}
                    expense={expense}
                    budget={props.budget}
                    categories={props.categories}
                    />
            ))
        }
    </React.Fragment>);