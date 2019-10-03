import * as React from "react";
import { YMD } from "../../interfaces";
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

    return (
    <React.Fragment>
        {budgetModel.getMonths(year).reverse().map((month) => (
            <CalendarMonth
                days={budgetModel.getDays(year, month)}
                key={`calendar-month-${year}-${month}`} 
                budgetModel={budgetModel}
                onDaySelected={props.onDaySelected}
                year={year} month={month}/>    
        ))}
        <SubHeader 
            variant='h5' 
            leftText={year} 
            rightText={getCurrencyWithSymbol(
                budgetModel.getTotalExpensesByYear(year), 
                budgetModel.currency)}/>
    </React.Fragment>);
}
