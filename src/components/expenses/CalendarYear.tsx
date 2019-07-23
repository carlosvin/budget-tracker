import * as React from "react";
import { YMD } from "../../interfaces";
import { round, desc } from "../../utils";
import { BudgetModel } from "../../BudgetModel";
import { SubHeader } from "./SubHeader";
import { CalendarMonth } from "./CalendarMonth";

interface CalendarYearProps {
    year: number;
    budgetModel: BudgetModel;
    onDaySelected: (day: YMD) => void;
}

export const CalendarYear: React.FC<CalendarYearProps> = (props) => {

    const {budgetModel, year} = props;

    return (
    <React.Fragment>
        {Object.keys(budgetModel.expenseGroups[year])
            .map(month => parseInt(month))
            .sort(desc)
            .map((month) => (
                <CalendarMonth
                    days={budgetModel.getDays(year, month)}
                    key={`calendar-month-${year}-${month}`} 
                    budgetModel={budgetModel}
                    onDaySelected={props.onDaySelected}
                    year={year} month={month}/>    
            ))
        }
        <SubHeader 
            variant='h5' 
            leftText={year} 
            rightText={round(budgetModel.getTotalExpensesByYear(year), 0)}/>
    </React.Fragment>);
}
