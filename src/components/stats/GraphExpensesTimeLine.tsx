import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphTimeLine } from "./Graph";
import { DateDay } from "../../domain/DateDay";

interface GraphExpensesTimeLineProps {
    budget: BudgetModel;
}

export const GraphExpensesTimeLine: React.FC<GraphExpensesTimeLineProps> = (props) => {
    const {budget} = props;

    
    const data = React.useMemo(() => {
        const {from, to} = budget;
        const today = Date.now();
        const fromDate = new Date(from);
        const points = [];
        for (let date=fromDate; date.getTime() <= to && date.getTime() <= today; date.setDate(date.getDate() + 1)) {
            const {year, month, day} = new DateDay(date);
            const total = budget.nestedTotalExpenses.getSubtotal([year, month, day]);
            points.push({x: new Date(date), y: total});
        }
        return points;
    }, [budget]);

    return <GraphTimeLine 
        title='By date' 
        data={data} 
        avg={budget.average}
        expectedAvg={budget.expectedDailyExpensesAverage}
         />;
}