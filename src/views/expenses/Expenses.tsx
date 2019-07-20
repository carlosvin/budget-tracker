import * as React from "react";
import { RouteComponentProps } from "react-router";
import { BudgetUrl } from "../../utils";
import { AddButton } from "../../components/buttons";
import { Expense, Budget } from "../../interfaces";
import { btApp } from "../../BudgetTracker";
import { ExpensesListGroup } from "../../components/expenses/ExpenseListGroup";

interface ExpensesViewProps extends
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
    const budgetUrl = new BudgetUrl(budgetId);

    const [expenses, setExpenses] = React.useState<Expense[]>();
    const [budget, setBudget] = React.useState<Budget>();
    const [expectedDailyAvg, setExpectedDailyAvg] = React.useState();
    
    React.useEffect(() => {
        async function fetchExpenses () {
            const bm = await btApp.budgetsStore.getBudgetModel(budgetId); 
            const expenseGroups = bm.expenseGroups;
            if (expenseGroups) {
                const expensesMap = expenseGroups[year][month][day];    
                setExpenses(Object.values(expensesMap));
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
            <React.Fragment>
                <ExpensesListGroup
                    budget={budget}
                    date={new Date(year, month, day)}
                    expenses={expenses} 
                    expectedDailyAvg={expectedDailyAvg}  />
                <AddButton href={budgetUrl.pathAddExpense}/>
            </React.Fragment>
        );
    }
    return <p>Loading...</p>;
    
}

export default ExpensesView;
