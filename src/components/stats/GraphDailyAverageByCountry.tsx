import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAverageDailyExpensesPerCountry } from "../../domain/stats/getAverageDailyExpensesPerCountry";
import { BarChart } from "./charts/Bar";

interface GraphByCategoryProps {
    budget: BudgetModel, 
}

export const GraphDailyAverageByCountry: React.FC<GraphByCategoryProps> = (props) => {
    const {budget} = props;

    const data = React.useMemo(() => {
            const totals = getAverageDailyExpensesPerCountry(budget);
            return {
                labels: Object.keys(totals), 
                values: Object.values(totals).map(v => Math.round(v))};
    }, [budget]);

    if (data) {
        return <BarChart title='Daily average by country' {...data} />;
    } else {
        return <CircularProgress/>;
    }
}