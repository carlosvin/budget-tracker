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
    }, []);
    
    React.useEffect(() => {
        async function fetchModels (store: BudgetsStore) {
            const bms: BudgetModel[] = [];
            for (const [_, v] of params) {
                bms.push(await store.getBudgetModel(v));
            }
            const bm = new BudgetModelCombined(bms);
            setBudgetModel(new BudgetModelCombined(bms));
            store.setBudgetModelCombined(bm);
        }

        if (store) {
            fetchModels(store);
        }
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
