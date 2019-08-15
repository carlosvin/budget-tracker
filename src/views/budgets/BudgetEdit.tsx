import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { HeaderNotifierProps } from "../../routes";
import { BudgetForm } from "../../components/budgets/BudgetForm";
import { btApp } from "../../BudgetTracker";
import { goBack } from "../../domain/utils/goBack";
import { BudgetUrl } from "../../domain/BudgetUrl";
import { DateDay } from "../../domain/DateDay";
import { uuid } from "../../domain/utils/uuid";
import MaterialIcon from "@material/react-material-icon";

interface BudgetEditProps extends 
    RouteComponentProps<{ budgetId: string }>, 
    HeaderNotifierProps {
}

const BudgetEdit: React.FC<BudgetEditProps> = (props) => {
    const fromDate = new DateDay();
    const budgetId = props.match.params.budgetId;
    
    const [budgetInfo, setBudgetInfo] = React.useState<Budget>({ 
        name: '', 
        from: fromDate.timeMs, 
        to: fromDate.addDays(30).timeMs,
        currency: 'EUR',
        total: 0,
        identifier: uuid()
    }); 

    function handleClose () {
        goBack(props.history);
    }

    async function fetchBudget(budgetId: string) {
        setBudgetInfo(await (await btApp.getBudgetsIndex()).getBudgetInfo(budgetId));
    }

    React.useEffect(
        () => {
            if (budgetId) {
                props.onTitleChange(`Edit budget`);
                fetchBudget(budgetId);
            } else {
                props.onTitleChange('New budget');
            }
            props.onActions([<MaterialIcon icon='close' onClick={handleClose} />]);
            return () => {
                props.onActions([]);
            }
        // eslint-disable-next-line 
        }, []
    );

    const [saving, setSaving] = React.useState(false);

    async function handleSubmit (budget: Budget) {
        setSaving(true);
        await (await btApp.getBudgetsStore()).setBudget(budget);
        setSaving(false);
        props.history.replace(new BudgetUrl(budget.identifier).path);
    }

    return  <BudgetForm 
        budget={budgetInfo}
        onSubmit={handleSubmit}
        disabled={saving}
        />;
}

export default BudgetEdit;
