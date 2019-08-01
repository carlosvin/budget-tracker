import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { VictoryPie, VictoryTheme } from "victory";
import { round } from "../../utils";

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

    return <VictoryPie 
        data={getData()} 
        colorScale='qualitative'
        theme={VictoryTheme.material} />;
}