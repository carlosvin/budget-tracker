import * as React from "react";
import List from '@material-ui/core/List';
import { RouteComponentProps } from "react-router";
import { Budget } from "../../interfaces";
import { BudgetListItem } from "../../components/budgets/BudgetListItem";
import { HeaderNotifierProps } from "../../routes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { btApp } from "../../BudgetTracker";
import { AddButton } from "../../components/buttons/AddButton";
import { ImportExportButton } from "../../components/buttons/ImportExportButton";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { AppPaths } from "../../domain/paths";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import SyncIcon from '@material-ui/icons/Sync';

interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

export const BudgetList: React.FC<BudgetListProps> = (props) => {

    const [budgets, setBudgets] = React.useState<Budget[]>();

    React.useEffect(() => {
        props.onTitleChange('Budget list');
        props.onActions(
            <React.Fragment>
                <AddButton to={BudgetPath.add}/>
                <ImportExportButton to={AppPaths.ImportExport}/>
            </React.Fragment>
        );
        async function fetchBudgets() {
            const index = await (await btApp.getBudgetsIndex()).getBudgetsIndex();
            setBudgets(Object.values(index));
        }
        fetchBudgets();
    // eslint-disable-next-line
    }, []);

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
            <CardHeader title='There are no budgets'></CardHeader>
            <CardContent>
                <Typography>
                    You can just <Link component={RouterLink} to={BudgetPath.add}>create a new one</Link>, <Link component={RouterLink} to={AppPaths.Sync}>synchronize your account</Link> to fetch your data from the cloud, <Link component={RouterLink}to={AppPaths.ImportExport}>import it from a JSON file</Link>
                </Typography>
            </CardContent>
            <CardActions>
                <Button component={RouterLink} to={BudgetPath.add} ><AddIcon/></Button>
                <Button component={RouterLink} to={AppPaths.Sync} ><SyncIcon/></Button>
                <ImportExportButton to={AppPaths.ImportExport}/>
            </CardActions>
        </Card>;
    }
}

export default BudgetList;
