import * as React from "react";
import { ExpenseList } from "./ExpenseList";
import { CategoriesMap } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { useLoc } from "../../hooks/useLoc";
import { HeaderNotifierProps } from "../../routes";
import { Typography } from "@material-ui/core";
import { DateDay } from "../../domain/DateDay";

interface ExpensesOutOfBudgetProps extends HeaderNotifierProps {
    budget: BudgetModel;
    categories: CategoriesMap;
}

export const ExpensesOutOfBudget: React.FC<ExpensesOutOfBudgetProps> = (props) => {
    const {budget, categories, onTitleChange} = props;
    const {expenseGroupsOut} = budget;

    const loc = useLoc();

    React.useEffect(() => {
        onTitleChange(loc('Expenses Out'));
    // eslint-disable-next-line
    }, []);

    return <React.Fragment>
                { expenseGroupsOut.allGroupedByDate.size > 0 && 
                <Typography >{loc('Expenses Out desc')}: {DateDay.fromTimeMs(budget.from).shortString} - {DateDay.fromTimeMs(budget.to).shortString}</Typography>
                }
                <ExpenseList 
                    budget={budget} 
                    categories={categories} 
                    expensesByGroup={ expenseGroupsOut.allGroupedByDate}/>
        </React.Fragment>;
}
