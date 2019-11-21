import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { CategoriesMap, Category } from "../../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getTotalsByCategory } from "../../domain/stats/getTotalsByCategory";
import { PieChart } from "./charts/Pie";
import { useLoc } from "../../hooks/useLoc";
import { CategoriesSelectInput } from "../categories/CategoriesSelectInput";

interface GraphByCategoryProps {
    budget: BudgetModel, 
    categories: CategoriesMap;
}

// It might happen that an expense has a category that was already deleted
function getCategoryName (index: string, categories: CategoriesMap) {
    return categories[index] ? categories[index].name : index;
}

export const GraphByCategory: React.FC<GraphByCategoryProps> = (props) => {
    const loc = useLoc();
    const {budget, categories} = props;


    const data = React.useMemo(() => {
        if (categories && Object.keys(categories).length > 0) {
            const labels: string[] = [];
            const values: number[] = [];
            const totals = getTotalsByCategory(budget);
            const indexes = totals.indexes;
            indexes.forEach((k) => {
                labels.push(getCategoryName(k, categories));
                values.push(Math.round(totals.getSubtotal([k,])));
            });
            return {labels, values};
        }
    }, [budget, categories]);

    function handleCategory (category: Category) {
        console.log('selected ', category);
    }

    if (data) {
        return <React.Fragment>
            { categories && <CategoriesSelectInput 
                categories={Object.values(categories)}
                onCategoryChange={handleCategory}/>
            }
            <PieChart title={loc('By category')} {...data} />
        </React.Fragment>;
    } else {
        return <CircularProgress/>;
    }
}