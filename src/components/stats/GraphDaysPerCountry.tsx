import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphPie } from "./Graph";

interface GraphDaysPerCountryProps {
    budget: BudgetModel
}

export const GraphDaysPerCountry: React.FC<GraphDaysPerCountryProps> = (props) => {
    const {budget} = props;

    function getData () {
        const groups = budget.expenseGroups; 
        const daysByCountry: {[country: string]: number} = {};
        for (const year in groups) {
            for (const month in groups[year]) {
                for (const day in groups[year][month]) {
                    const countriesInADay = new Set<string>();
                    for (const id in groups[year][month][day]) {
                        const expense = groups[year][month][day][id];
                        countriesInADay.add(expense.countryCode);
                    }
                    countriesInADay.forEach(c=> {
                        if (c in daysByCountry) {
                            daysByCountry[c] += 1;
                        } else {
                            daysByCountry[c] = 1;
                        }
                    });
                }
            }
        }
        return Object
            .entries(daysByCountry)
            .map(([country, total]) => ({x: country, y: total}));
    }
    // TODO show number of days in graph
    
    return <GraphPie title='Days in a country' data={getData()} />;
}