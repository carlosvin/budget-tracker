import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { DateDay } from "../../domain/DateDay";
import { HeatMapChart } from "./charts/HeatMap";
import { ObjectMap } from "../../api";
import { useLoc } from "../../hooks/useLoc";

interface GraphExpensesHeatMapProps {
    budget: BudgetModel;
}

export const GraphExpensesHeatMap: React.FC<GraphExpensesHeatMapProps> = (props) => {
    const {budget} = props;
    const loc = useLoc();

    const data = React.useMemo(() => {
        const {from, to} = budget;
        const today = Date.now();
        const fromDate = new Date(from);
        const data: ObjectMap<number> = {};
        for (let date=fromDate; 
            date.getTime() <= to && date.getTime() <= today; 
            date.setDate(date.getDate() + 1)) {
                const {year, month, day} = new DateDay(date);
                const total = budget.nestedTotalExpenses.getSubtotal([year, month, day]);
                data[date.getTime()/1000] = Math.round(total);
        }
        return data;
    }, [budget]);

    return <HeatMapChart
        title={loc('Heat map')} 
        dataPoints={data}
        start={new Date(budget.from)}
         />;
}