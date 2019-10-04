import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { Categories } from "../../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getTotalsByCategory } from "../../domain/stats/getTotalsByCategory";
import { PieChart } from "./charts/Pie";

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

    const data = React.useMemo(() => {
        if (categoriesMap && Object.keys(categoriesMap).length > 0) {
            const labels: string[] = [];
            const values: number[] = [];
            const totals = getTotalsByCategory(budget);
            const indexes = totals.indexes;
            indexes.forEach((k) => {
                labels.push(getCategoryName(k, categoriesMap));
                values.push(Math.round(totals.getSubtotal([k,])));
            });
            return {labels, values};
        }
    }, [budget, categoriesMap]);

    if (data) {
        return <PieChart title='By Category' {...data} />;
    } else {
        return <CircularProgress/>;
    }
}