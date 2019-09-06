import * as React from "react";
import List from '@material-ui/core/List';
import { Budget, ExpensesDayMap, Expense, ExpensesMap } from "../../interfaces";
import { ExpensesListGroup } from "./ExpenseListGroup";

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
