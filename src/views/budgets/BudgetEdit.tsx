import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { BudgetForm } from "../../components/budgets/BudgetForm";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { DateDay } from "../../domain/DateDay";
import { uuid } from "../../domain/utils/uuid";
import { CloseButtonHistory } from "../../components/buttons/CloseButton";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { HeaderNotifierProps } from "../../routes";
import { useAppContext } from "../../contexts/AppContext";
import { useHeaderContext } from "../../hooks/useHeaderContext";

interface BudgetEditProps extends 
    RouteComponentProps<{ budgetId: string }>, 
    HeaderNotifierProps {
}

const BudgetEdit: React.FC<BudgetEditProps> = (props) => {
    const budgetId = props.match.params.budgetId;
    
    const [budgetInfo, setBudgetInfo] = React.useState<Budget>();
    const btApp = useAppContext();

    // TODO create useBudgetInfo to speed up loading by skipping expenses calculations
    const budget = useBudgetModel(budgetId);

    function newEmptyBudget () {
        const fromDate = new DateDay();
        return { 
            name: '', 
            from: fromDate.timeMs, 
            to: fromDate.addDays(30).timeMs,
            currency: 'EUR',
            total: 0,
            identifier: uuid()
        };
    }

    React.useEffect(
        () => {
            if (budget) {
                setBudgetInfo(budget.info);
            }
        }, [budget]
    );

    useHeaderContext(budgetId ? 'Edit budget' : 'Add Budget',
        <CloseButtonHistory history={props.history}/>, 
        props);

    React.useEffect(() => {
        !budgetId && setBudgetInfo(newEmptyBudget()); 
    }, [budgetId]);

    const [saving, setSaving] = React.useState(false);

    async function handleSubmit (budget: Budget) {
        setSaving(true);
        await (await btApp.getBudgetsStore()).setBudget(budget);
        setSaving(false);
        props.history.replace(new BudgetPath(budget.identifier).path);
    }

    if (budgetInfo) {
        return  <BudgetForm 
        budget={budgetInfo}
        onSubmit={handleSubmit}
        disabled={saving}
        />;
    }
    return <p>Loading...</p>;

}

export default BudgetEdit;
