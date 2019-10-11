import * as React from "react";
import List from '@material-ui/core/List';
import { Budget } from "../../api";
import { ExpensesListGroup } from "./ExpenseListGroup";
import { DateDay } from "../../domain/DateDay";
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
        {[...props.expensesByDay.entries()]
            .map(([when, expenses]) => (
                <ExpensesListGroup
                key={`lg-${when}`} 
                date={DateDay.fromTimeMs(when)}
                budget={props.budget}
                expenses={expenses.values()}
                expectedDailyAvg={props.expectedDailyAvg}/>)
        )}
    </List>
);
