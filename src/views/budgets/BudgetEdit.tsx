import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { BudgetUrl, goBack } from "../../utils";
import { CloseButton } from "../../components/buttons";
import { HeaderNotifierProps } from "../../routes";
import { BudgetForm } from "../../components/budgets/BudgetForm";
import { btApp } from "../../BudgetTracker";

interface BudgetEditProps extends 
    RouteComponentProps<{ budgetId: string }>, 
    HeaderNotifierProps {
}

const BudgetEdit: React.FC<BudgetEditProps> = (props) => {

    const budgetId = props.match.params.budgetId;
    const [budgetInfo, setBudgetInfo] = React.useState<Budget|undefined>(); 

    function handleClose () {
        goBack(props.history);
    }

    async function fetchBudget(budgetId: string) {
        setBudgetInfo(await btApp.budgetsStore.getBudgetInfo(budgetId));
    }

    React.useEffect(
        () => {
            if (budgetId) {
                props.onTitleChange(`Edit budget`);
                fetchBudget(budgetId);
            } else {
                props.onTitleChange('New budget');
            }
            props.onActions(<CloseButton onClick={handleClose} />);
            return () => {
                props.onActions([]);
            }
        // eslint-disable-next-line
        }, []
    );

    const [saving, setSaving] = React.useState(false);

    async function handleSubmit (budget: Budget) {
        setSaving(true);
        await btApp.budgetsStore.setBudget(budget);
        setSaving(false);
        props.history.replace(new BudgetUrl(budget.identifier).path);
    }

    return <BudgetForm 
        budget={budgetInfo}
        onSubmit={handleSubmit}
        disabled={saving}
    />;
}

export default BudgetEdit;
