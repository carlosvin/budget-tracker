import * as React from "react";
import { YMD } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { SubHeader } from "./SubHeader";
import { CalendarMonth } from "./CalendarMonth";
import { getCurrencyWithSymbol } from "../../domain/utils/getCurrencyWithSymbol";

interface CalendarYearProps {
    year: number;
    budgetModel: BudgetModel;
    onDaySelected: (day: YMD) => void;
}

export const CalendarYear: React.FC<CalendarYearProps> = (props) => {

    const {budgetModel, year} = props;
    const {expenseGroups, currency} = budgetModel;

    return (
    <React.Fragment>
        {[...expenseGroups.getMonths(year)].reverse().map((month) => (
            <CalendarMonth
                days={expenseGroups.getDays(year, month)}
                key={`calendar-month-${year}-${month}`} 
                budgetModel={budgetModel}
                onDaySelected={props.onDaySelected}
                year={year} month={month}/>    
        ))}
        <SubHeader 
            variant='h5' 
            leftText={year} 
            rightText={getCurrencyWithSymbol(budgetModel.getTotalExpensesByYear(year), currency)}/>
    </React.Fragment>);
}
