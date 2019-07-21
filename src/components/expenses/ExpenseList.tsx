import * as React from "react";
import List from '@material-ui/core/List';
import { Budget, ExpensesDayMap, Expense, ExpensesMap } from "../../interfaces";
import './ExpenseList.css';
import { ExpensesListGroup } from "./ExpenseListGroup";

interface ExpenseListProps {
    budget: Budget;
    expensesByDay: ExpensesDayMap;
    expectedDailyAvg: number;
}

export const ExpenseList: React.FC<ExpenseListProps> = (props) => (
    <List className='expenseListRoot'>
        {Object.values(props.expensesByDay)
            .map((e: ExpensesMap) => Object.values(e))
            .filter((expenses: Expense[]) => expenses && expenses.length > 0)
            .map((expenses: Expense[]) => ({
                expenses: Object.values(expenses), 
                date: new Date(expenses[0].when)}))
            .map(({expenses, date}) => 
                <ExpensesListGroup
                    key={`lg-${date.getTime()}`} 
                    budget={props.budget}
                    expenses={expenses}
                    expectedDailyAvg={props.expectedDailyAvg}/>)}
    </List>
);
