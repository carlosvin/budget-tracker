import * as React from "react";
import { YMD } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { CalendarYear } from "./CalendarYear";

interface ExpensesCalendarProps {
    budgetModel: BudgetModel;
    onDaySelected: (day: YMD) => void;
}

export const ExpensesCalendar: React.FC<ExpensesCalendarProps> = (props) => {

    const {budgetModel} = props;

    return <React.Fragment>
        {
            [...budgetModel.expenseGroups.years].reverse()
                .map(year => (
                    <CalendarYear 
                        budgetModel={budgetModel}
                        key={`calendar-year-${year}`}
                        year={year} 
                        onDaySelected={props.onDaySelected} />
                ))
        }
    </React.Fragment>;
}
