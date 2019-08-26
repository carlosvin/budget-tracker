import * as React from "react";
import { BudgetModel } from "../../domain/BudgetModel";
import { GraphTimeLine } from "./Graph";
import { DateDay } from "../../domain/DateDay";

interface GraphExpensesTimeLineProps {
    budget: BudgetModel;
}

export const GraphExpensesTimeLine: React.FC<GraphExpensesTimeLineProps> = (props) => {
    const {budget} = props;

    function getData () {
        const {from, to} = budget.info;
        const today = new Date().getTime();
        const fromDate = new Date(from);
        const data = [];
        for (let date=fromDate; date.getTime() <= to && date.getTime() <= today; date.setDate(date.getDate() + 1)) {
            const {year, month, day} = new DateDay(date);
            const total = budget.nestedTotalExpenses.getSubtotal([year, month, day]);
            data.push({x: new Date(date), y: total});
        }
        return data;
    }

    return <GraphTimeLine 
        title='By date' 
        data={getData()} 
        avg={budget.average}
        expectedAvg={budget.expectedDailyExpensesAverage}
         />;
}