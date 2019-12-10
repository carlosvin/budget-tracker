import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { getTotalDaysByCountry } from "../../domain/stats/getTotalDaysByCountry";
import { PieChart } from "./charts/Pie";
import { useLocalization } from "../../hooks/useLocalization";

interface GraphDaysPerCountryProps {
    budget: BudgetModel
}

export const GraphDaysPerCountry: React.FC<GraphDaysPerCountryProps> = (props) => {
    const {budget} = props;
    const loc = useLocalization();

    const data = React.useMemo(() => {
        const daysByCountry = getTotalDaysByCountry(budget);
        const labels: string[] = [];
        const values: number[] = [];
        Object
            .entries(daysByCountry)
            .forEach(([country, total]) => {
                labels.push(country);
                values.push(Math.round(total));
            });
        return {labels, values};
    }, [budget]);

    return <PieChart title={loc.get('Days in a country')} {...data} />;
}
