import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";

interface GraphDaysPerCountryProps {
    budget: BudgetModel
}

export const GraphDaysPerCountry: React.FC<GraphDaysPerCountryProps> = (props) => {
    const {budget} = props;

    function getData () {
        const daysByCountry = budget.totalDaysByCountry;
        return Object
            .entries(daysByCountry)
            .map(([country, total]) => ({x: country, y: total}));
    }
    
    return <GraphPie title='Days in a country' data={getData()} />;
}