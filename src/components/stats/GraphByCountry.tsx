import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { getTotalsByCountry } from "../../domain/stats/getTotalsByCountry";
import { PieChart } from "./charts/Pie";

interface GraphByCountryProps {
    budget: BudgetModel
}

export const GraphByCountry: React.FC<GraphByCountryProps> = (props) => {
    const {budget} = props;

    const data = React.useMemo(() => {
        const totals = getTotalsByCountry(budget);
        const indexes = totals.indexes;
        const labels: string[] = [];
        const values: number[] = [];
        indexes.forEach(k => {
            labels.push(k);
            values.push(Math.round(totals.getSubtotal([k,])));
        });
        return {labels, values};
    }, [budget]);

    return <PieChart title='By country' {...data} />;
}
