import * as React from "react";
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";

interface ExpensesListGroupProps {
    budget: Budget;
    expenses: Expense[];
    expectedDailyAvg: number;
}

export const ExpensesListGroup: React.FC<ExpensesListGroupProps> = (props) => (
    
    <React.Fragment>
        {
            props.expenses.map((expense) => (
                <ExpenseListItem 
                    key={`expense-${expense.identifier}`}
                    expense={expense}
                    budget={props.budget}/>
            ))
        }
    </React.Fragment>
);