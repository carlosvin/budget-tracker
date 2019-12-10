import * as React from "react";
import { ExpenseList } from "./ExpenseList";
import { CategoriesMap } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import { DateDay } from "../../domain/DateDay";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { AppButton } from "../buttons/buttons";
import DateRange from "@material-ui/icons/DateRange";
import { useLocalization } from "../../hooks/useLocalization";

interface ExpensesOutOfBudgetProps extends HeaderNotifierProps {
    budget: BudgetModel;
    categories: CategoriesMap;
}

export const ExpensesOutOfBudget: React.FC<ExpensesOutOfBudgetProps> = (props) => {
    const {budget, categories, onTitleChange} = props;
    const {expenseGroupsOut, identifier} = budget;
    const {path} = new BudgetPath(identifier);

    const loc = useLocalization();

    React.useEffect(() => {
        onTitleChange(loc.get('Expenses Out'));
    // eslint-disable-next-line
    }, []);

    const budgetRange = `${DateDay.fromTimeMs(budget.from).shortString} - ${DateDay.fromTimeMs(budget.to).shortString}`;

    return <React.Fragment>
            <Card>
                <CardHeader 
                    title={budgetRange}
                    action={<AppButton to={path} icon={DateRange} replace/>}></CardHeader>
                <CardContent>
                <Typography>{loc.get('Expenses Out desc')}:</Typography>
                <Typography variant='caption'>
                
                </Typography>
                </CardContent>
                <CardActionArea>
                    <ExpenseList 
                    budget={budget} 
                    categories={categories} 
                    expensesByGroup={ expenseGroupsOut.allGroupedByDate}/>
                </CardActionArea>
            </Card>
        </React.Fragment>;
}
