import * as React from "react";
import { ExpenseList } from "../../components/expenses/ExpenseList";
import Typography from "@material-ui/core/Typography";
import { Expense } from "../../api";
import { BudgetModel } from "../../domain/BudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { useLoc } from "../../hooks/useLoc";
import { HeaderNotifierProps } from "../../routes";
import { useHeaderContext } from "../../hooks/useHeaderContext";

interface ExpensesByCategoryProps extends HeaderNotifierProps {
    categoryId: string;
    budget: BudgetModel;
}

export const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = (props) => {
    const {budget, categoryId} = props;

    const [expenses, setExpenses] = React.useState<Map<string, Map<string, Expense>>>();
    const categories = useCategories();
    const loc = useLoc();

    React.useEffect(() => {
        props.onTitleChange(loc('By Category'));
        if (categories && categoryId in categories) {
            const categoryName = categories[categoryId].name;
            const expensesMap = new Map<string, Expense>();
            const expensesByCategory = new Map([[categoryName, expensesMap]]);
            for (const expense of budget.expenses) {
                if (expense.categoryId === categoryId) {
                    expensesMap.set(expense.identifier, expense);
                }
            }
            setExpenses(expensesByCategory);
        }
    }, [budget, categories, categoryId]);

    if (expenses) {
        return <ExpenseList 
                budget={budget.info}
                expensesByGroup={expenses} />;
    } else {
        return <Typography>{loc('No expenses')}</Typography>;
    }
}
