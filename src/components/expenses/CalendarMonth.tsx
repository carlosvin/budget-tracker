import * as React from "react";
import { YMD } from "../../api";
import { monthToString } from "../../domain/date";
import { BudgetModel } from "../../domain/BudgetModel";
import { SubHeader } from "./SubHeader";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import { CalendarDay } from "./CalendarDay";

interface CalendarMonthProps {
    days: Iterable<number>;
    year: number;
    month: number;
    onDaySelected: (day: YMD) => void;
    budgetModel: BudgetModel;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = (props) => {
    const { year, month, budgetModel, days } = props;
    const total = React.useMemo(() => {
        const totalByMonth = budgetModel.getTotalExpenses(year, month);
        return Math.round(totalByMonth).toLocaleString();
    }, [budgetModel, year, month]);

    const daysView = React.useMemo(() => (
        [...days]
            .reverse()
            .map((day) => (
                <CalendarDay
                    onDaySelected={props.onDaySelected}
                    expected={budgetModel.expectedDailyExpensesAverage}
                    total={budgetModel.getTotalExpenses(year, month, day)}
                    budgetId={budgetModel.identifier}
                    date={{ year, month, day }}
                    key={`calendar-day-${year}-${month}-${day}`} />))
    // eslint-disable-next-line
    ), [days, budgetModel, year, month]);

    return (
        <Card key={`expenses-month-${year}-${month}`} style={{ marginBottom: '1rem' }}>
            <CardHeader
                title={<SubHeader
                    leftText={monthToString(props.month)}
                    rightText={total}
                    variant='h6' />} />
            <CardContent>
                { daysView }
            </CardContent>
        </Card >);
}
