import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";
import { round } from "../../domain/utils/round";
import { useCategories } from "../../hooks/useCategories";

interface GraphByCategoryProps {
    budget: BudgetModel, 
}

export const GraphByCategory: React.FC<GraphByCategoryProps> = (props) => {
    const {budget} = props;

    const categoriesMap = useCategories();

    // It might happen that an expense has a category that was already deleted
    function getCategoryName (index: string) {
        return categoriesMap[index] ? categoriesMap[index].name : 'Deleted category';
    }

    function getData () {
        const totals = budget.totalsByCategory;
        const indexes = totals.indexes;
        const ignoreThreshold = totals.total * 0.05;
        return indexes
            .map(k => ({x: getCategoryName(k), y: totals.getSubtotal([k,])}))
            .filter(({y}) => y > ignoreThreshold)
            .map(({x, y}) => ({x, y: round(y, 0)})
        );
    }

    return <GraphPie title='By Category' data={getData()} />;
}