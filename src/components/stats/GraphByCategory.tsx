import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { VictoryPie, VictoryTheme } from "victory";
import { Categories } from "../../interfaces";
import { round } from "../../utils";

interface GraphByCategoryProps {
    budget: BudgetModel, 
    categoriesMap: Categories;
}

export const GraphByCategory: React.FC<GraphByCategoryProps> = (props) => {
    const {budget, categoriesMap} = props;

    function getData () {
        const totals = budget.totalsByCategory;
        const indexes = totals.indexes;
        const ignoreThreshold = totals.total * 0.05;
        return indexes
            .map(k => ({x: categoriesMap[k].name, y: totals.getSubtotal([k,])}))
            .filter(({y}) => y > ignoreThreshold)
            .map(({x, y}) => ({x, y: round(y, 0)})
        );
    }

    return <VictoryPie 
        data={getData()} 
        colorScale='qualitative'
        theme={VictoryTheme.material} />;
}