import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Expense } from "../../api";
import { DeleteButton } from "../../components/buttons/DeleteButton";
import { goBack } from "../../domain/utils/goBack";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { DateDay } from "../../domain/DateDay";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { ExpenseForm } from "../../components/expenses/ExpenseForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import { HeaderNotifierProps } from "../../routes";
import { useAppContext } from "../../contexts/AppContext";
import { useHeaderContext } from "../../hooks/useHeaderContext";
import { useLocalization } from "../../hooks/useLocalization";

interface ExpenseEditProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string; expenseId: string }> { }

export const ExpenseEdit: React.FC<ExpenseEditProps> = (props) => {
    
    const btApp = useAppContext();

    const {budgetId, expenseId} = props.match.params;
    const {history} = props;
    const {replace} = history;
    const budgetUrl = new BudgetPath(budgetId);
    const budgetModel = useBudgetModel(budgetId);

    const [expense, setExpense] = React.useState<Expense>();
    const loc = useLocalization();

    async function handleDelete () {
        await (await btApp.getBudgetsStore()).deleteExpense(budgetId, expenseId);
        replace(budgetUrl.path);
    }

    useHeaderContext(loc.get('Edit expense'), <DeleteButton onClick={handleDelete}/>, props);

    React.useEffect(() => {
        if (budgetModel) {
            setExpense(budgetModel.getExpense(expenseId));
        }
        // eslint-disable-next-line
    }, [budgetModel, expenseId]);

    async function handleSubmit(expense: Expense) {
        const {year, month, day} = DateDay.fromTimeMs(expense.when);
        goBack(
            props.history, 
            budgetUrl.pathExpensesByDay(year, month, day));
    }

    if (budgetModel && expense) {
        return <ExpenseForm 
            onSubmit={handleSubmit}
            baseCurrency={budgetModel.info.currency}
            {...expense}
            />;
    } else {
        return <CircularProgress/>;
    }
    
}

export default ExpenseEdit;
