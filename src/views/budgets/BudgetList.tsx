import * as React from "react";
import List from '@material-ui/core/List';
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { BudgetListItem } from "../../components/budgets/BudgetListItem";
import { AddButton, ImportExportButton } from "../../components/buttons";
import { BudgetUrl } from "../../utils";
import { HeaderNotifierProps } from "../../routes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { btApp } from "../../BudgetTracker";

interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

export const BudgetList: React.FC<BudgetListProps> = (props) => {

    const [budgets, setBudgets] = React.useState<Budget[]>();

    React.useEffect(() => {
        props.onTitleChange('Budget list');
        props.onActions(
            <React.Fragment>
                <AddButton href={BudgetUrl.add}/>
                <ImportExportButton to='/import'/>
            </React.Fragment>
        );
    // eslint-disable-next-line
    }, []);

    React.useEffect(
        () => {
            async function fetchBudgets() {
                const index = await btApp.budgetsStore.getBudgetsIndex();
                setBudgets(Object.values(index));
            }
            fetchBudgets();
        },
        [budgets]
    );

    if (budgets === undefined) {
        return null;
    }
    if (budgets.length > 0) {
        return (
            <List>{
                budgets
                    .map(budget => <BudgetListItem key={budget.identifier} {...budget} />)
            }
            </List>);
    } else {
        return <Card>
            <CardContent>
                There are no budgets, please add one.
            </CardContent>
        </Card>;
    }
}

export default BudgetList;
