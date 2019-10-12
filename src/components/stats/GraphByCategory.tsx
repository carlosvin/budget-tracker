import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { CategoriesMap } from "../../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getTotalsByCategory } from "../../domain/stats/getTotalsByCategory";
import { PieChart } from "./charts/Pie";
import { useLoc } from "../../hooks/useLoc";

interface GraphByCategoryProps {
    budget: BudgetModel, 
}

// It might happen that an expense has a category that was already deleted
function getCategoryName (index: string, categories: CategoriesMap) {
    return categories[index] ? categories[index].name : index;
}

export const GraphByCategory: React.FC<GraphByCategoryProps> = (props) => {
    const loc = useLoc();
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

    function handleCategory (categoryId: string) {
        console.log(categoryId);
    }

    if (data) {
        return <PieChart title={loc('By category')} {...data} onSelect={handleCategory} />;
    } else {
        return <CircularProgress/>;
    }
}