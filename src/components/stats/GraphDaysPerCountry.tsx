import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";
import { TotalDaysByCountry } from "../../domain/BudgetStats";

interface GraphDaysPerCountryProps {
    budget: BudgetModel
}

export const GraphDaysPerCountry: React.FC<GraphDaysPerCountryProps> = (props) => {
    const {budget} = props;

    const data = React.useMemo(() => {
        const {daysByCountry} = new TotalDaysByCountry(budget);
        return Object
            .entries(daysByCountry)
            .map(([country, total]) => ({x: country, y: total}));
    }, [budget]);

    return <GraphPie title='Days in a country' data={data} />;
}
