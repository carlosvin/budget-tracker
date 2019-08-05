import * as React from "react";
import { YMD } from "../../interfaces";
import { monthToString } from "../../utils";
import { BudgetModel } from "../../domain/BudgetModel";
import { SubHeader } from "./SubHeader";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import { CalendarDay } from "./CalendarDay";
import { round } from "../../domain/utils/round";

interface CalendarMonthProps {
    days: number[];
    year: number;
    month: number;
    onDaySelected: (day: YMD) => void;
    budgetModel: BudgetModel;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = (props) => {
    const {year, month, budgetModel, days} = props;

    return (
    <Card key={`expenses-month-${year}-${month}`} style={{marginBottom: '1rem'}}>
            <CardHeader 
                title={<SubHeader 
                    leftText={monthToString(new Date(2000, props.month, 1))}
                    rightText={round(budgetModel.getTotalExpensesByMonth(year, month), 0)} 
                    variant='h6'/>} />                
            <CardContent>
                {
                    Object.values(days)
                    .map((day) => (
                        <CalendarDay 
                            onDaySelected={props.onDaySelected}
                            expected={budgetModel.expectedDailyExpensesAverage}
                            total={ budgetModel.getTotalExpensesByDay(year, month, day) }
                            budgetId={budgetModel.identifier}
                            date={{year, month, day}}
                            key={`calendar-day-${year}-${month}-${day}`} />
                    ))
                }
            </CardContent>
        </Card >
    );
}
