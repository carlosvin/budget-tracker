import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { useBudgetsStore } from "../../hooks/useBudgetsStore";
import { BudgetsStore } from "../../domain/stores/interfaces";
import { BudgetModel } from "../../domain/BudgetModel";
import { BudgetModelCombined } from "../../domain/BudgetModelCombined";
import { BudgetQuickStats } from "../../components/budgets/BudgetQuickStats";
import { BudgetPath } from "../../domain/paths/BudgetPath";

interface BudgetCombinedViewProps extends
    HeaderNotifierProps,
    RouteComponentProps<{}> { 
}

export const BudgetCombinedView: React.FC<BudgetCombinedViewProps> = (props) => {
    
    const params = new URLSearchParams(props.location.search);
    const store = useBudgetsStore();

    const [budgetModel, setBudgetModel] = React.useState<BudgetModel>();

    React.useEffect(() => {
        props.onTitleChange('Combined budgets');
        props.onActions([]);
    // eslint-disable-next-line
    }, []);
    
    React.useEffect(() => {
        async function fetchModels (store: BudgetsStore) {
            const budgetModels: BudgetModel[] = [];
            for (const v of params.values()) {
                budgetModels.push(await store.getBudgetModel(v));
            }
            const bm = new BudgetModelCombined(budgetModels);
            setBudgetModel(bm);
            store.setBudgetModelCombined(bm);
        }

        if (store) {
            fetchModels(store);
        }
    // eslint-disable-next-line
    }, [store]);

    if (budgetModel) {
        return (
            <BudgetQuickStats 
                dailyAverage={budgetModel.average}
                expectedDailyAverage={budgetModel.expectedDailyExpensesAverage}
                passedDays={budgetModel.daysUntilToday}
                totalDays={budgetModel.totalDays}
                totalBudget={budgetModel.total}
                totalSpent={budgetModel.totalExpenses}
                urlStats={new BudgetPath(budgetModel.identifier).pathStats }
        />);
    } else {
        return <p>Loading {params}</p>;
    }
    
}

export default BudgetCombinedView;
