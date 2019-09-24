import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { CloseButtonHistory } from "../../components/buttons/CloseButton";
import { BudgetStatsComponents } from "../../components/stats/BudgetStats";

interface BudgetStatsViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const BudgetStatsView: React.FC<BudgetStatsViewProps> = (props) => {
    
    const {match, history, onActions, onTitleChange} = props;
    const {budgetId} = match.params;
    const budgetPath = new BudgetPath(budgetId);
    
    const budget = useBudgetModel(budgetId);

    React.useEffect(
        () => {
            onTitleChange(`Statistics: ${budget && budget.name}`);
            onActions(<CloseButtonHistory history={history} to={budgetPath.path}/>);
            return function () { onActions([]); }
        // eslint-disable-next-line 
        }, [budget]);

    if (budget === undefined) {
        return <p>Loading budget...</p>;
    } else {
        return <BudgetStatsComponents budget={budget}/>;
    }
}

export default BudgetStatsView;
