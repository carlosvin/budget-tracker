import * as React from "react";
import { ExpensesYearMap, ExpensesMonthMap, ExpensesDayMap, YMD } from "../../interfaces";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { monthToString, round, isTodayYMD, desc } from "../../utils";
import { ExpenseModel } from "../../BudgetModel";

interface ExpensesCalendarProps {
    expensesYearMap: ExpensesYearMap;
    budgetId: string;
    expectedDailyExpenses: number;
    onDaySelected: (day: YMD) => void;
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
                            onDaySelected={props.onDaySelected}
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
    onDaySelected: (day: YMD) => void;
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
                        onDaySelected={props.onDaySelected}
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
    onDaySelected: (day: YMD) => void;
}

const ExpensesDay: React.FC<ExpensesDayProps> = (props) => {
    const {year, month, expensesDayMap} = props;

    return <Grid container justify='flex-start' alignContent='center'>
    {
        Object.entries(expensesDayMap)
            .map(([day, expenses]) => ([parseInt(day), expenses]))
            .map(([day, expenses]) => (
                    <Day 
                        onDaySelected={props.onDaySelected}
                        expected={props.expectedDailyExpenses}
                        budgetId={props.budgetId}
                        isToday={isTodayYMD({year, month, day})}
                        day={day} 
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


interface DayProps extends YMD {
    total: number; 
    expected: number; 
    isToday?: boolean; 
    budgetId: string;
    onDaySelected: (day: YMD) => void;
};

const Day: React.FC<DayProps> = (props) => {
    
    function handleDaySelected () {
        props.onDaySelected(props);
    }

    return <Button 
        variant={props.isToday ? 'outlined' : 'text'} 
        onClick={handleDaySelected} >
        <Box p={1}>
            <Typography color='textPrimary'>{props.day}</Typography>
            <Typography variant='caption' color={props.total > props.expected ? 'error' : 'textSecondary'}>{props.total}</Typography>
        </Box>
    </Button>;
}