import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget, ExpensesDayMap } from "../../interfaces";
import { btApp } from "../../BudgetTracker";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import { HeaderNotifierProps } from "../../routes";

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
    const params = new URLSearchParams(props.location.search);
    // TODO get expenses even if a search param is missing
    const year = getParamInt('year', params) || 0;
    const month = getParamInt('month', params) || 0;
    const day = getParamInt('day', params)|| 0;
    props.onTitleChange(new Date(year, month, day).toDateString());

    const [expenses, setExpenses] = React.useState<ExpensesDayMap>();
    const [budget, setBudget] = React.useState<Budget>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState();
    
    React.useEffect(() => {
        async function fetchExpenses () {
            const bm = await btApp.budgetsStore.getBudgetModel(budgetId); 
            const expenseGroups = bm.expenseGroups;
            if (expenseGroups) {
                const expensesMap = expenseGroups[year][month][day];    
                setExpenses({[day]: expensesMap});
                setExpectedDailyAvg(bm.expectedDailyExpensesAverage);
            }
        }

        async function initBudget () {
            const b = await btApp.budgetsStore.getBudgetInfo(budgetId);
            setBudget(b);
        }
        fetchExpenses();
        initBudget();
    }, [year, month, day, budgetId]);

    if (expenses && expectedDailyAvg && budget) {
        // show link to parent budget
        return (
            <ExpenseList 
                budget={budget}
                expensesByDay={expenses} 
                expectedDailyAvg={expectedDailyAvg}  />
        );
    }
    return <p>Loading...</p>;
    
}

export default ExpensesView;
