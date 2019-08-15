import * as React from "react";
import List from '@material-ui/core/List';
import { RouteComponentProps, Redirect } from "react-router";
import { Budget } from "../../interfaces";
import { BudgetListItem } from "../../components/budgets/BudgetListItem";
import { HeaderNotifierProps } from "../../routes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { btApp } from "../../BudgetTracker";
import { BudgetUrl } from "../../domain/BudgetUrl";
import MaterialIcon from "@material/react-material-icon";
import { FabButton } from "../../components/buttons";

interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

export const BudgetList: React.FC<BudgetListProps> = (props) => {

    const [budgets, setBudgets] = React.useState<Budget[]>();
    const [redirect, setRedirect] = React.useState();

    React.useEffect(() => {
        function redirectToAdd () {
            setRedirect(BudgetUrl.add);
        }
        function redirectToImport () {
            setRedirect('/import');
        }
        props.onTitleChange('Budget list');
        props.onActions([
            <MaterialIcon icon='import' onClick={redirectToImport}/>
        ]);
        async function fetchBudgets() {
            const index = await (await btApp.getBudgetsIndex()).getBudgetsIndex();
            setBudgets(Object.values(index));
        }
        fetchBudgets();
    // eslint-disable-next-line
    }, []);

    if (redirect) {
        return <Redirect to={redirect} />;
    }
    
    if (budgets === undefined) {
        return null;
    }
    if (budgets.length > 0) {
        return (
            <List>{
                budgets
                    .map(budget => <BudgetListItem key={budget.identifier} {...budget} />)
            }
            <FabButton path={BudgetUrl.add} onRedirect={setRedirect} icon='add'/>
            </List>
        );
    } else {
        return <Card>
            <CardContent>
                There are no budgets, please add one.
            </CardContent>
        </Card>;
    }
}

export default BudgetList;
