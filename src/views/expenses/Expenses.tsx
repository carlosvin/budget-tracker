import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { ExpensesByCategory } from "../../components/expenses/ExpensesByCategory";
import { ExpensesByDate } from "../../components/expenses/ExpensesByDate";
import { AddButton } from "../../components/buttons/AddButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCategories } from "../../hooks/useCategories";

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
    const category = params.get('category');

    const budgetModel = useBudgetModel(budgetId);
    const categories = useCategories();

    function ByCategory () {
        return (budgetModel && category && categories) ? 
            <ExpensesByCategory 
                budget={budgetModel} 
                categoryId={category} 
                categories={categories}
                {...props}/> : 
            <CircularProgress/>;
    }

    function ByDate () {
        return (budgetModel && categories) ? <ExpensesByDate 
            budget={budgetModel}
            year={year}
            month={month}
            day={day}
            categories={categories}
            {...props} /> : <CircularProgress/>;
    }
    
    return <React.Fragment>
        { category ? <ByCategory/> : <ByDate/> }
        <AddButton to={pathAddExpense}/>
    </React.Fragment>;
    
}

export default ExpensesView;
