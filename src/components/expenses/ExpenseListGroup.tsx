import * as React from "react";
import { Expense, Budget } from "../../api";
import { ExpenseListItem } from "./ExpenseListItem";
import { ListSubheader } from "@material-ui/core";
import { DateDay } from "../../domain/DateDay";

interface ExpensesListGroupProps {
    budget: Budget;
    expenses: Iterable<Expense>;
    expectedDailyAvg: number;
    date: DateDay;
}

export const ExpensesListGroup: React.FC<ExpensesListGroupProps> = (props) => (
    <React.Fragment>
        <ListSubheader 
            component='div' 
            id={`subheader-${props.date}`} >
            { props.date.shortString }
        </ListSubheader>
        {
            Array.from(props.expenses).map((expense) => (
                <ExpenseListItem 
                    key={`expense-${expense.identifier}`}
                    expense={expense}
                    budget={props.budget}/>
            ))
        }
    </React.Fragment>);