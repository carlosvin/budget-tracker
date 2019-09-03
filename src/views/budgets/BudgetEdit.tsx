import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { HeaderNotifierProps } from "../../routes";
import { BudgetForm } from "../../components/budgets/BudgetForm";
import { btApp } from "../../BudgetTracker";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { DateDay } from "../../domain/DateDay";
import { uuid } from "../../domain/utils/uuid";
import { CloseButton } from "../../components/buttons/CloseButton";

interface BudgetEditProps extends 
    RouteComponentProps<{ budgetId: string }>, 
    HeaderNotifierProps {
}

const BudgetEdit: React.FC<BudgetEditProps> = (props) => {
    const budgetId = props.match.params.budgetId;
    
    const [budgetInfo, setBudgetInfo] = React.useState<Budget>(); 

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
            async function fetchBudget(budgetId: string) {
                setBudgetInfo(await (await btApp.getBudgetsIndex()).getBudgetInfo(budgetId));
            }

            if (budgetId) {
                props.onTitleChange(`Edit budget`);
                fetchBudget(budgetId);
            } else {
                props.onTitleChange('New budget');
                setBudgetInfo(newEmptyBudget());
            }
            props.onActions(<CloseButton history={props.history}/>);
            return function () {
                props.onActions(undefined);
            }
        // eslint-disable-next-line 
        }, []
    );

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
