import * as React from "react";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import Typography from "@material-ui/core/Typography";
import { Expense, CategoriesMap } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { useLoc } from "../../hooks/useLoc";
import { HeaderNotifierProps } from "../../routes";
import { Box } from "@material-ui/core";
import { VersusInfo } from "../VersusInfo";

interface ExpensesByCategoryProps extends HeaderNotifierProps {
    categoryId: string;
    budget: BudgetModel;
    categories: CategoriesMap;
}

export const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = (props) => {
    const {budget, categoryId, categories} = props;
    const [expenses, setExpenses] = React.useState<Map<string, Map<string, Expense>>>();
    const [total, setTotal] = React.useState(0);
    const loc = useLoc();
    
    React.useEffect(() => {
        props.onTitleChange(`${loc('Expenses in')} ${categories && categories[categoryId].name}`);
    // eslint-disable-next-line
    }, [categoryId, categories]);

    React.useEffect(() => {
        const expensesByDate = new Map();
        let sum = 0;
        for (const expense of budget.expenses) {
            if (expense.categoryId === categoryId) {
                const key = expense.date.shortString;
                let expensesMap = expensesByDate.get(key);
                if (!expensesMap) {
                    expensesMap = new Map();
                    expensesByDate.set(key, expensesMap);
                }
                expensesMap.set(expense.identifier, expense);
                sum += expense.amountBaseCurrency;
            }
        }
        setExpenses(expensesByDate);
        setTotal(sum);
    }, [budget, categoryId]);

    if (expenses) {
        return <React.Fragment>
            <Box padding={1} marginBottom={2} >
                <VersusInfo 
                    title={loc('Spent')} 
                    spent={total}
                    total={budget.totalExpenses}/>
            </Box>
            <ExpenseList 
                budget={budget.info}
                expensesByGroup={expenses} 
                categories={categories} />
        </React.Fragment>;
    } else {
        return <Typography>{loc('No expenses')}</Typography>;
    }
}
