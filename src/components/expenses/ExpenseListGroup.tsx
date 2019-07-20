import * as React from "react";
import { Expense, Budget } from "../../interfaces";
import { ExpenseListItem } from "./ExpenseListItem";
import { ExpenseListSubHeader } from "./ExpenseListSubHeader";
import { ExpenseModel } from "../../BudgetModel";

interface ExpensesListGroupProps {
    budget: Budget;
    date?: Date;
    expenses: Expense[];
    expectedDailyAvg: number;
}

export const ExpensesListGroup: React.FC<ExpensesListGroupProps> = (props) => (
    
    <React.Fragment>
        <ExpenseListSubHeader 
            date={props.date} 
            expectedDailyAvg={props.expectedDailyAvg} 
            // TODO pass sum as property when it is part of precalculated data in budget model
            totalSpent={ExpenseModel.sum(props.expenses)}/>

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