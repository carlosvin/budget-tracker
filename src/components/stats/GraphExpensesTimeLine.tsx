import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { DateDay } from "../../domain/DateDay";
import { TimeLineChart } from "./charts/TimeLine";

interface GraphExpensesTimeLineProps {
    budget: BudgetModel;
}

export const GraphExpensesTimeLine: React.FC<GraphExpensesTimeLineProps> = (props) => {
    const {budget} = props;

    
    const data = React.useMemo(() => {
        const {from, to} = budget;
        const today = Date.now();
        const fromDate = new Date(from);
        const labels = [];
        const values = [];
        for (let date=fromDate; date.getTime() <= to && date.getTime() <= today; date.setDate(date.getDate() + 1)) {
            const {year, month, day} = new DateDay(date);
            const total = budget.nestedTotalExpenses.getSubtotal([year, month, day]);
            labels.push(new DateDay(date));
            values.push(Math.round(total));
        }
        return {labels, values};
    }, [budget]);

    return <TimeLineChart 
        title='By date' 
        {...data}
        avg={budget.average}
        expectedAvg={budget.expectedDailyExpensesAverage}
         />;
}