import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";
import { round } from "../../domain/utils/round";

interface GraphByCountryProps {
    budget: BudgetModel, 
}

export const GraphByCountry: React.FC<GraphByCountryProps> = (props) => {
    const {budget} = props;

    function getData () {
        const totals = budget.totalsByCountry;
        const indexes = totals.indexes;
        const ignoreThreshold = totals.total * 0.05;
        return indexes
            .map(k => ({x: k, y: totals.getSubtotal([k,])}))
            .filter(({y}) => y > ignoreThreshold)
            .map(({x, y}) => ({x, y: round(y, 0)})
        );
    }

    return <GraphPie title='By country' data={getData()} />;
}