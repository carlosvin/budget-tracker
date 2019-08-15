import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { ExpensesDayMap } from "../../interfaces";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import { HeaderNotifierProps } from "../../routes";
import { VersusInfo } from "../../components/VersusInfo";
import Box from "@material-ui/core/Box";
import { BudgetUrl } from "../../domain/BudgetUrl";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { FabButton } from "../../components/buttons";

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
    const {pathAddExpense} = new BudgetUrl(budgetId);
    
    const params = new URLSearchParams(props.location.search);

    // TODO get expenses even if a search param is missing
    const year = getParamInt('year', params) || 0;
    const month = getParamInt('month', params) || 0;
    const day = getParamInt('day', params)|| 0;

    props.onTitleChange(new Date(year, month, day).toDateString());

    const [expenses, setExpenses] = React.useState<ExpensesDayMap>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState();
    const [totalSpent, setTotalSpent] = React.useState();
    const [redirect, setRedirect] = React.useState<string>();

    const budgetModel = useBudgetModel(budgetId);
    
    React.useEffect(() => {
        if (budgetModel) {
            const expenseGroups = budgetModel.expenseGroups;
            if (expenseGroups) {
                const expensesMap = expenseGroups[year][month][day];    
                setExpenses({[day]: expensesMap});
                setExpectedDailyAvg(budgetModel.expectedDailyExpensesAverage);
                setTotalSpent(budgetModel.getTotalExpensesByDay(year, month, day));
            }
        }
    }, [year, month, day, budgetModel]);

    if (redirect) {
        return <Redirect to={redirect}/>;
    }

    if (expenses && expectedDailyAvg && budgetModel) {
        // TODO show link to parent budget
        return (
            <React.Fragment>
                <Box padding={1} marginBottom={3} >
                    <VersusInfo title='Daily expenses' spent={totalSpent} total={expectedDailyAvg}/>
                </Box>
                <ExpenseList 
                    budget={budgetModel.info}
                    expensesByDay={expenses} 
                    expectedDailyAvg={expectedDailyAvg}  />
                <FabButton path={pathAddExpense} onRedirect={setRedirect} icon='add'/>
            </React.Fragment>
        );
    }
    return <p>Loading...</p>;
}

export default ExpensesView;
