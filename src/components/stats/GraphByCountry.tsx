import * as React from "react";
import { GraphPie } from "./Graph";
import { round } from "../../domain/utils/round";
import { BudgetStatsByCountry } from "../../domain/BudgetStats";
import { BudgetModel } from "../../domain/BudgetModel";

interface GraphByCountryProps {
    budget: BudgetModel
}

export const GraphByCountry: React.FC<GraphByCountryProps> = (props) => {
    const {budget} = props;

    const data = React.useMemo(() => {
        const totals = new BudgetStatsByCountry(budget).totalsByCountry;
        const indexes = totals.indexes;
        const ignoreThreshold = totals.total * 0.05;
        return indexes
            .map(k => ({x: k, y: totals.getSubtotal([k,])}))
            .filter(({y}) => y > ignoreThreshold)
            .map(({x, y}) => ({x, y: round(y, 0)})
        );
    }, [budget]);

    return <GraphPie title='By country' data={data} />;
}
