import React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { useBudgetsStore } from "../../hooks/useBudgetsStore";
import { BudgetsStore } from "../../domain/stores/interfaces";
import { BudgetModel } from "../../domain/BudgetModel";
import { BudgetModelCombined } from "../../domain/BudgetModelCombined";
import { BudgetQuickStats } from "../../components/budgets/BudgetQuickStats";
import { BudgetStatsComponents } from "../../components/stats/BudgetStats";
import { CloseButtonHistory } from "../../components/buttons/CloseButton";
import { useHeaderContext } from "../../hooks/useHeaderContext";
import { useLoc } from "../../hooks/useLoc";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCategories } from "../../hooks/useCategories";

interface BudgetCombinedViewProps extends
    HeaderNotifierProps,
    RouteComponentProps<{}> { 
}

export const BudgetCombinedView: React.FC<BudgetCombinedViewProps> = (props) => {
    
    const params = new URLSearchParams(props.location.search);
    const store = useBudgetsStore();
    const categories = useCategories();

    const [budgetModel, setBudgetModel] = React.useState<BudgetModel>();
    const loc = useLoc();

    useHeaderContext(loc('Combined budgets'), <CloseButtonHistory history={props.history}/>, props);
    
    React.useEffect(() => {
        async function fetchModels (store: BudgetsStore) {
            const budgetModels: BudgetModel[] = [];
            for (const v of params.values()) {
                budgetModels.push(await store.getBudgetModel(v));
            }
            const bm = new BudgetModelCombined(budgetModels);
            setBudgetModel(bm);
        }

        if (store) {
            fetchModels(store);
        }
    // eslint-disable-next-line
    }, [store]);

    if (budgetModel) {
        return (
        <React.Fragment>
            <BudgetQuickStats 
                dailyAverage={budgetModel.average}
                expectedDailyAverage={budgetModel.expectedDailyExpensesAverage}
                passedDays={budgetModel.daysUntilToday}
                totalDays={budgetModel.totalDays}
                totalBudget={budgetModel.total}
                totalSpent={budgetModel.totalExpenses}
            />
            <BudgetStatsComponents categories={categories} budget={budgetModel}/>
        </React.Fragment>);
    } else {
        return <CircularProgress/>
    }
    
}

export default BudgetCombinedView;
