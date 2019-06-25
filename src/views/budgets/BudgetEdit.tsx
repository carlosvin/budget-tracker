import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import { BudgetUrl, goBack } from "../../utils";
import { CloseButton } from "../../components/buttons";
import { HeaderNotifierProps } from "../../routes";
import { BudgetForm } from "../../components/BudgetForm";

interface BudgetEditProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{
}

const BudgetEdit: React.FC<BudgetEditProps> = (props) => {

    const budgetId = props.match.params.budgetId;

    function handleClose () {
        goBack(props.history);
    }

    React.useEffect(
        () => {
            if (budgetId) {
                props.onTitleChange(`Edit budget`);
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
        await budgetsStore.setBudget(budget);
        setSaving(false);
        props.history.replace(new BudgetUrl(budget.identifier).path);
    }

    return <BudgetForm 
        budget={budgetId ? budgetsStore.getBudgetInfo(budgetId) : undefined}
        onSubmit={handleSubmit}
        disabled={saving}
    />;
}

export default BudgetEdit;
