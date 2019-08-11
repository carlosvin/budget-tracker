import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget, ExpensesDayMap } from "../../interfaces";
import { btApp } from "../../BudgetTracker";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import { HeaderNotifierProps } from "../../routes";
import { VersusInfo } from "../../components/VersusInfo";
import Box from "@material-ui/core/Box";
import { AddButton } from "../../components/buttons/AddButton";
import { BudgetUrl } from "../../domain/BudgetUrl";

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
    const [budget, setBudget] = React.useState<Budget>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState();
    const [totalSpent, setTotalSpent] = React.useState();
    
    
    React.useEffect(() => {
        async function fetchExpenses () {
            const bm = await (await btApp.getBudgetsStore()).getBudgetModel(budgetId);
            setBudget(bm.info);
            const expenseGroups = bm.expenseGroups;
            if (expenseGroups) {
                const expensesMap = expenseGroups[year][month][day];    
                setExpenses({[day]: expensesMap});
                setExpectedDailyAvg(bm.expectedDailyExpensesAverage);
                setTotalSpent(bm.getTotalExpensesByDay(year, month, day));
            }
        }
        fetchExpenses();
    }, [year, month, day, budgetId]);

    if (expenses && expectedDailyAvg && budget) {
        // show link to parent budget
        return (
            <React.Fragment>
                <Box padding={1} marginBottom={3} >
                    <VersusInfo title='Daily expenses' spent={totalSpent} total={expectedDailyAvg}/>
                </Box>
                <ExpenseList 
                    budget={budget}
                    expensesByDay={expenses} 
                    expectedDailyAvg={expectedDailyAvg}  />
                <AddButton to={pathAddExpense}/>
            </React.Fragment>
        );
    }
    return <p>Loading...</p>;
    
}

export default ExpensesView;
