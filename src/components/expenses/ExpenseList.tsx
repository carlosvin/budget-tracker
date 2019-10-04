import * as React from "react";
import List from '@material-ui/core/List';
import { Budget, Expense } from "../../api";
import { ExpensesListGroup } from "./ExpenseListGroup";
import { ExpensesDayMap } from "../../domain/ExpensesYearMap";

interface ExpenseListProps {
    budget: Budget;
    expensesByDay: ExpensesDayMap;
    expectedDailyAvg: number;
}

export const ExpenseList: React.FC<ExpenseListProps> = (props) => (
    <List style={{
        height: '100%', 
        backgroundColor: '#fff', 
        position: 'relative', 
        overflow: 'auto', 
        listStyleType: 'none'}}>
        {[...props.expensesByDay.values()]
            .map(e => [...e.values()])
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
