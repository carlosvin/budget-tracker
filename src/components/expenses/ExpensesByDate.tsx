import * as React from "react";
import { ExpenseList } from "./ExpenseList";
import { HeaderNotifierProps } from "../../routes";
import { VersusInfo } from "../VersusInfo";
import Box from "@material-ui/core/Box";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { DateDay } from "../../domain/DateDay";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AppButton } from "../buttons/buttons";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import DateRange from "@material-ui/icons/DateRange";
import { ExpensesDayMap } from "../../domain/ExpensesYearMap";
import { Expense, YMD, CategoriesMap } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { useLocalization } from "../../hooks/useLocalization";

interface ExpensesByDateProps extends Partial<YMD>, HeaderNotifierProps {
    budget: BudgetModel;
    categories: CategoriesMap;
}

export const ExpensesByDate: React.FC<ExpensesByDateProps> = (props) => {
    const {year, month, day, budget, categories, onTitleChange} = props;
    const budgetPath = new BudgetPath(budget.identifier);
    const loc = useLocalization();
    const [expenses, setExpenses] = React.useState<Map<string, Map<string, Expense>>>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState<number>();
    const [totalSpent, setTotalSpent] = React.useState(0);

    const {dateTitle, prevDate, nextDate, numberOfDays} = React.useMemo(() => {
        function getTitle(year?: number, month?: number, day?: number) {
            if (day === undefined) {
                if (month === undefined) {
                    return year === undefined ? 'All' : year.toString();
                } else {
                    if (year === undefined) {
                        throw new Error('Year is required');
                    }
                    return loc.monthYearToString(year, month);
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
                    return DateDay.fromYMD({year, month: 0, day: 1}).addYears(increment)
                } else if (day === undefined) {
                    return DateDay.fromYMD({year, month, day: 1}).addMonths(increment)
                } else {
                    return DateDay.fromYMD({year, month, day}).addDays(increment)
                }
            }
        }

        function getNextUrl(increment=1) {
            const date = getNextDate(increment);
            if (date) {
                return budgetPath.pathExpensesByDay(date.year, month && date.month, day && date.day);
            }
        }

        function getNumberOfDays () {
            if (month === undefined) {
                return 365;
            } else if (day === undefined) {
                return 30
            } else {
                return 1;
            }
        }

        return {
            dateTitle: getTitle(year, month, day),
            prevDate: getNextUrl(-1),
            nextDate: getNextUrl(1),
            numberOfDays: getNumberOfDays()
        };
    }, [year, month, day, budgetPath, loc]);

    React.useEffect(() => {
        const expenseGroups = budget.expenseGroupsIn;
        if (expenseGroups) {
            const expensesByDay: ExpensesDayMap|undefined = budget.getExpensesByDay(year, month, day);
            if (expensesByDay) {
                const expensesByGroups = new Map<string, Map<string, Expense>>();
                for (const [when, expensesMap] of expensesByDay) {
                    const key = DateDay.fromTimeMs(when).shortString;
                    let savedExpensesMap = expensesByGroups.get(key);
                    if (!savedExpensesMap) {
                        savedExpensesMap = new Map();
                        expensesByGroups.set(key, savedExpensesMap);
                    }
                    for (const [identifier, expense] of expensesMap) {
                        savedExpensesMap.set(identifier, expense);
                    }
                }
                setExpenses(expensesByGroups);
                setTotalSpent(year ? budget.getTotalExpenses(year, month, day) : budget.total);
            } else {
                setExpenses(undefined);
                setTotalSpent(0);
            }
            setExpectedDailyAvg(budget.expectedDailyExpensesAverage);
        }
    // eslint-disable-next-line
    }, [year, month, day, budget]);

    // eslint-disable-next-line
    React.useEffect(() => (onTitleChange(dateTitle)), [dateTitle]);

    return (
        <React.Fragment>
            <Box padding={1} marginBottom={2} >
                { expectedDailyAvg !== undefined && <VersusInfo 
                    title={loc.get('Daily expenses')} 
                    spent={totalSpent}
                    total={expectedDailyAvg * numberOfDays}/> }
                <Grid container justify='space-between' direction='row' style={{marginTop: '1.5em'}}>
                    { prevDate && <AppButton to={prevDate} icon={NavigateBefore} replace/> }
                    <AppButton to={budgetPath.path} icon={DateRange} replace/>
                    { nextDate && <AppButton to={nextDate} icon={NavigateNext} replace/> }
                </Grid>
            </Box>
            { expenses===undefined && <Typography>{loc.get('No expenses')}</Typography> }
            { expenses && <ExpenseList 
                budget={budget}
                expensesByGroup={expenses} categories={categories} /> }
        </React.Fragment>);
}
