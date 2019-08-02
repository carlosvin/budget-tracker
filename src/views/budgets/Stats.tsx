import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { btApp } from "../../BudgetTracker";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphByCategory } from "../../components/stats/GraphByCategory";
import { Categories } from "../../interfaces";
import { GraphByCountry } from "../../components/stats/GraphByCountry";
import { GraphExpensesTimeLine } from "../../components/stats/GraphExpensesTimeLine";

interface BudgetStatsProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const BudgetStats: React.FC<BudgetStatsProps> = (props) => {
    
    const {budgetId} = props.match.params;

    const [budget, setBudget] = React.useState<BudgetModel>();
    const [categories, setCategories] = React.useState<Categories>();

    React.useEffect(
        () => {
            async function fetchBudget() {
                const budget = await btApp.budgetsStore.getBudgetModel(budgetId);
                setBudget(budget);
            }
            fetchBudget();
        }, 
        [budgetId]
    );

    React.useEffect(
        () => {
            async function fetchCategories() {
                const categories = await btApp.categoriesStore.getCategories();
                setCategories(categories);
            }
            fetchCategories();
        }, 
        []
    );
    
    if (budget === undefined) {
        return <p>Loading budget...</p>;
    }

    return <React.Fragment>
        {budget && <GraphExpensesTimeLine budget={budget}/>}
        {budget && categories && <GraphByCategory budget={budget} categoriesMap={categories}/>}
        {budget && <GraphByCountry budget={budget}/>}
    </React.Fragment>;

}

export default BudgetStats;
