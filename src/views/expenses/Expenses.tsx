import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import { HeaderNotifierProps } from "../../routes";
import { VersusInfo } from "../../components/VersusInfo";
import Box from "@material-ui/core/Box";
import { AddButton } from "../../components/buttons/AddButton";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { DateDay } from "../../domain/DateDay";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AppButton } from "../../components/buttons/buttons";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import DateRange from "@material-ui/icons/DateRange";
import { monthYearToString } from "../../domain/date";
import { ExpensesDayMap } from "../../domain/ExpensesYearMap";

interface ExpensesViewProps extends
    HeaderNotifierProps,
    RouteComponentProps<{budgetId: string, year: string, month: string, day: string}> { 
}

function getParamInt(name: string, params: URLSearchParams) {
    const param = params.get(name);
    return param ? parseInt(param) : undefined;
}

export const ExpensesView: React.FC<ExpensesViewProps> = (props) => {

    const {budgetId} = props.match.params;
    const url = new BudgetPath(budgetId);
    const {pathAddExpense} = url;
    
    const params = new URLSearchParams(props.location.search);

    const year = getParamInt('year', params);
    const month = getParamInt('month', params);
    const day = getParamInt('day', params);

    const {dateTitle, prevDate, nextDate} = React.useMemo(() => {
        function getTitle(year?: number, month?: number, day?: number) {
            if (day === undefined) {
                if (month === undefined) {
                    return year === undefined ? 'All' : year.toString();
                } else {
                    if (year === undefined) {
                        throw new Error('Year is required');
                    }
                    return monthYearToString(year, month);
                }
            } else {
                if (year === undefined || month === undefined) {
                    throw new Error('Year and month are required');
                }
                return DateDay.fromYMD({year, month, day}).shortString;
            }
        }

        function getNextDate(increment=1) {
            if (year === undefined) {
                return undefined;
            } else {
                if (month === undefined) {
                    return DateDay.fromYMD({year, month: 0, day: 0}).addYears(increment)
                } else if (day === undefined) {
                    return DateDay.fromYMD({year, month, day: 0}).addMonths(increment)
                } else {
                    return DateDay.fromYMD({year, month, day}).addDays(increment)
                }
            }
        }

        function getNextUrl(increment=1) {
            const date = getNextDate(increment);
            if (date) {
                return url.pathExpensesByDay(date.year, month && date.month, day && date.day);
            }
        }

        return {
            dateTitle: getTitle(year, month, day),
            prevDate: getNextUrl(-1),
            nextDate: getNextUrl(1),
        };
    }, [year, month, day, url]);

    const [expenses, setExpenses] = React.useState<ExpensesDayMap>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState();
    const [totalSpent, setTotalSpent] = React.useState(0);

    const budgetModel = useBudgetModel(budgetId);
    
    React.useEffect(() => {
        props.onTitleChange(dateTitle);
        if (budgetModel) {
            const expenseGroups = budgetModel.expenseGroups;
            if (expenseGroups) {
                const expensesByDay = budgetModel.getExpensesByDay(year, month, day);
                if (expensesByDay) {
                    setExpenses(expensesByDay);
                    setTotalSpent(year ? budgetModel.getTotalExpenses(year, month, day) : budgetModel.total);
                } else {
                    setExpenses(undefined);
                    setTotalSpent(0);
                }
                setExpectedDailyAvg(budgetModel.expectedDailyExpensesAverage);
            }
        }
    // eslint-disable-next-line
    }, [year, month, day, budgetModel]);

    if (expenses) {
        return (<React.Fragment>
            <Box padding={1} marginBottom={2} >
                <VersusInfo 
                    title='Daily expenses' 
                    spent={totalSpent} 
                    total={expectedDailyAvg * expenses.size}/>
                <Grid container justify='space-between' direction='row' style={{marginTop: '1.5em'}}>
    { prevDate && <AppButton to={prevDate} icon={NavigateBefore} replace/> }
                    <AppButton to={url.path} icon={DateRange} replace/>
    { nextDate && <AppButton to={nextDate} icon={NavigateNext} replace/> }
                </Grid>
            </Box>
            { expenses===undefined && <Typography>No expenses</Typography> }
            { budgetModel && expenses && <ExpenseList 
                budget={budgetModel.info}
                expensesByDay={expenses} 
                expectedDailyAvg={expectedDailyAvg} /> }
            <AddButton to={pathAddExpense}/>
        </React.Fragment>);
    } else {
        return null;
    }
}

export default ExpensesView;
