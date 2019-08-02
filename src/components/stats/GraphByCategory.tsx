import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { Categories } from "../../interfaces";
import { round } from "../../utils";
import { GraphPie } from "./Graph";

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

    return <GraphPie title='By Category' data={getData()} />;
}