import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";
import { round } from "../../domain/utils/round";
import { useCategories } from "../../hooks/useCategories";
import { Categories } from "../../interfaces";
import CircularProgress from "@material-ui/core/CircularProgress";

interface GraphByCategoryProps {
    budget: BudgetModel, 
}

// It might happen that an expense has a category that was already deleted
function getCategoryName (index: string, categories: Categories) {
    return categories[index] ? categories[index].name : index;
}

export const GraphByCategory: React.FC<GraphByCategoryProps> = (props) => {
    const {budget} = props;

    const categoriesMap = useCategories();

    function getData (categories: Categories) {
        const totals = budget.totalsByCategory;
        const indexes = totals.indexes;
        const ignoreThreshold = totals.total * 0.03;
        return indexes
            .map(k => ({x: getCategoryName(k, categories), y: totals.getSubtotal([k,])}))
            .filter(({y}) => y > ignoreThreshold)
            .map(({x, y}) => ({x, y: round(y, 0)})
        );
    }

    if (categoriesMap) {
        return <GraphPie title='By Category' data={getData(categoriesMap)} />;
    } else {
        return <CircularProgress/>;
    }
}