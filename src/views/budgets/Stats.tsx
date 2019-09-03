import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { GraphByCategory } from "../../components/stats/GraphByCategory";
import { GraphByCountry } from "../../components/stats/GraphByCountry";
import { GraphExpensesTimeLine } from "../../components/stats/GraphExpensesTimeLine";
import { GraphDaysPerCountry } from "../../components/stats/GraphDaysPerCountry";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { CloseButton } from "../../components/buttons/CloseButton";

interface BudgetStatsProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const BudgetStats: React.FC<BudgetStatsProps> = (props) => {
    
    const {match, history, onActions} = props;
    const {budgetId} = match.params;
    const budgetPath = new BudgetPath(budgetId);
    
    const budget = useBudgetModel(budgetId);
    const categories = useCategories();

    React.useEffect(
        () => {
            onActions([<CloseButton history={history} to={budgetPath.path}/>]);
            return function () { onActions([]); }
        // eslint-disable-next-line 
        }, []);

    if (budget === undefined) {
        return <p>Loading budget...</p>;
    }

    return <React.Fragment>
        {budget && categories && <GraphByCategory budget={budget} categoriesMap={categories}/>}
        {budget && <GraphByCountry budget={budget}/>}
        {budget && <GraphDaysPerCountry budget={budget}/>}
        {budget && <GraphExpensesTimeLine budget={budget}/>}
    </React.Fragment>;

}

export default BudgetStats;
