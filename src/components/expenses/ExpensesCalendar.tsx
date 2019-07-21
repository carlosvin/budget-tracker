import * as React from "react";
import { ExpensesYearMap, ExpensesMonthMap, ExpensesDayMap } from "../../interfaces";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { monthToString, round, isTodayYMD, desc } from "../../utils";
import { ExpenseModel } from "../../BudgetModel";
import { Link } from "react-router-dom";

interface ExpensesCalendarProps {
    expensesYearMap: ExpensesYearMap;
    budgetId: string;
    expectedDailyExpenses: number;
}

export const ExpensesCalendar: React.FC<ExpensesCalendarProps> = (props) => {

    return <React.Fragment>
        {
            Object.keys(props.expensesYearMap)
                .map(year => parseInt(year))
                .sort(desc)
                .map(year => (
                    <div key={`cal-year-${year}`}>
                        <ExpensesMonth 
                            expectedDailyExpenses={props.expectedDailyExpenses}
                            budgetId={props.budgetId}
                            expensesMonthMap={props.expensesYearMap[year]}
                            year={year} />
                    </div>
                    )
                )
        }
    </React.Fragment>;
}

interface ExpensesMonthProps {
    expensesMonthMap: ExpensesMonthMap;
    year: number;
    budgetId: string;
    expectedDailyExpenses: number;
}

const ExpensesMonth: React.FC<ExpensesMonthProps> = (props) => {
    const {year, expensesMonthMap} = props;

    return <React.Fragment>
    {
        Object.keys(expensesMonthMap)
            .map(month => parseInt(month))
            .sort(desc)
            .map((month) => (
                <React.Fragment key={`expenses-month-${year}-${month}`}>
                    <Month month={month} year={year}/>
                    <ExpensesDay 
                        expectedDailyExpenses={props.expectedDailyExpenses}
                        budgetId={props.budgetId}
                        year={year}
                        month={month}
                        expensesDayMap={props.expensesMonthMap[month]}/>
                </React.Fragment >)
            )
    }
    </React.Fragment>;
}

interface ExpensesDayProps {
    expensesDayMap: ExpensesDayMap;
    month: number;
    year: number;
    budgetId: string;
    expectedDailyExpenses: number;
}

const ExpensesDay: React.FC<ExpensesDayProps> = (props) => {
    const {year, month, expensesDayMap} = props;

    return <Grid container justify='flex-start' alignContent='center'>
    {
        Object.entries(expensesDayMap)
            .map(
                ([day, expenses]) => (
                    <Day 
                        expected={props.expectedDailyExpenses}
                        budgetId={props.budgetId}
                        isToday={isTodayYMD(year, month, parseInt(day))}
                        day={parseInt(day)} 
                        month={month}
                        year={year}
                        total={round(ExpenseModel.sum(expenses), 0)} 
                        key={`day-${year}-${month}-${day}`}/>
                )
            )
    }
    </Grid>;
}

// TODO add total in the month
const Month: React.FC<{month: number, year: number}> = (props) => (
    <Grid container justify='space-between'>
        <Typography variant='h6' color='textPrimary'>
            {monthToString(new Date(2000, props.month, 1))}
        </Typography>
        <Typography variant='overline'>{props.year}</Typography>
    </Grid>
);

const Day: React.FC<{year: number, month: number, day: number, total: number, expected: number, isToday?: boolean, budgetId: string}> = (props) => (
    <Button 
        variant={props.isToday ? 'outlined' : 'text'} 
        component={Link} 
        to={`/budgets/${props.budgetId}/expenses?year=${props.year}&month=${props.month}&day=${props.day}`}>
        <Box p={1}>
            <Typography color='textPrimary'>{props.day}</Typography>
            <Typography variant='caption' color={props.total > props.expected ? 'error' : 'textSecondary'}>{props.total}</Typography>
        </Box>
    </Button>
);