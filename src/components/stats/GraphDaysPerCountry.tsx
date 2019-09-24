import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";
import { getTotalDaysByCountry } from "../../domain/stats/getTotalDaysByCountry";

interface GraphDaysPerCountryProps {
    budget: BudgetModel
}

export const GraphDaysPerCountry: React.FC<GraphDaysPerCountryProps> = (props) => {
    const {budget} = props;

    const data = React.useMemo(() => {
        const daysByCountry = getTotalDaysByCountry(budget);
        return Object
            .entries(daysByCountry)
            .map(([country, total]) => ({x: country, y: total}));
    }, [budget]);

    return <GraphPie title='Days in a country' data={data} />;
}
