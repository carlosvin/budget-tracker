import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { CloseButtonHistory } from "../../components/buttons/CloseButton";
import { BudgetStatsComponents } from "../../components/stats/BudgetStats";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHeaderContext } from "../../hooks/useHeaderContext";
import { useCategories } from "../../hooks/useCategories";
import { useLocalization } from "../../hooks/useLocalization";

interface BudgetStatsViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const BudgetStatsView: React.FC<BudgetStatsViewProps> = (props) => {
    
    const {match, history} = props;
    const {budgetId} = match.params;
    const budgetPath = new BudgetPath(budgetId);
    
    const budget = useBudgetModel(budgetId);
    const categories = useCategories();
    const loc = useLocalization();

    React.useEffect(() => (
        budget && props.onTitleChange(`${loc.get('Statistics')}: ${budget.name}`)),
    // eslint-disable-next-line 
    [budget]);

    useHeaderContext(`${loc.get('Statistics')}`, 
        <CloseButtonHistory history={history} to={budgetPath.path}/>, 
        props);

    if (budget === undefined) {
        return <CircularProgress/>;
    } else {
        return <BudgetStatsComponents budget={budget} categories={categories}/>;
    }
}

export default BudgetStatsView;
