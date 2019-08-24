import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ExpensesDayMap } from "../../interfaces";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import { HeaderNotifierProps } from "../../routes";
import { VersusInfo } from "../../components/VersusInfo";
import Box from "@material-ui/core/Box";
import { AddButton } from "../../components/buttons/AddButton";
import { BudgetUrl } from "../../domain/BudgetUrl";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { Link } from "react-router-dom";
import { DateDay } from "../../domain/DateDay";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
    const url = new BudgetUrl(budgetId);
    const {pathAddExpense} = url;
    
    const params = new URLSearchParams(props.location.search);

    // TODO get expenses even if a search param is missing
    const year = getParamInt('year', params) || 0;
    const month = getParamInt('month', params) || 0;
    const day = getParamInt('day', params)|| 0;
    const date = new Date(year, month, day);
    const dateDay = new DateDay(date);
    const prevDate = new DateDay(date).addDays(-1);
    const nextDate = new DateDay(date).addDays(1);

    props.onTitleChange(dateDay.shortString);

    const [expenses, setExpenses] = React.useState<ExpensesDayMap>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState();
    const [totalSpent, setTotalSpent] = React.useState();

    const budgetModel = useBudgetModel(budgetId);
    
    React.useEffect(() => {
        if (budgetModel) {
            const expenseGroups = budgetModel.expenseGroups;
            if (expenseGroups) {
                const expensesMap = expenseGroups[year][month][day];
                if (expensesMap) {
                    setExpenses({[day]: expensesMap});
                    setTotalSpent(budgetModel.getTotalExpensesByDay(year, month, day));
                } else {
                    setExpenses(undefined);
                    setTotalSpent(0);
                }
                setExpectedDailyAvg(budgetModel.expectedDailyExpensesAverage);
            }
        }
    }, [year, month, day, budgetModel]);

    return (
        <React.Fragment>
            <Box padding={1} marginBottom={2} >
                <VersusInfo title='Daily expenses' spent={totalSpent} total={expectedDailyAvg}/>
                <Grid container justify='space-between' direction='row' style={{marginTop: '1.5em'}}>
                    <Link to={url.pathExpensesByDay(prevDate)}>Prev</Link>
                    <Link to={url.path}>To budget</Link>
                    <Link to={url.pathExpensesByDay(nextDate)}>Next</Link>
                </Grid>
            </Box>
            { expenses===undefined && <Typography>No expenses</Typography> }
            { budgetModel && expenses && <ExpenseList 
                budget={budgetModel.info}
                expensesByDay={expenses} 
                expectedDailyAvg={expectedDailyAvg} /> }
            <AddButton to={pathAddExpense}/>
        </React.Fragment>);
}

export default ExpensesView;
