import * as React from "react";
import List from '@material-ui/core/List';
import { RouteComponentProps } from "react-router";
import { BudgetListItem } from "../../components/budgets/BudgetListItem";
import { HeaderNotifierProps } from "../../routes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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
import { useBudgetsIndex } from "../../hooks/useBudgetsIndex";
import { CloseButton } from "../../components/buttons/CloseButton";
import MergeIcon from '@material-ui/icons/MergeType';
import { ButtonFab } from "../../components/buttons/buttons";

interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

export const BudgetList: React.FC<BudgetListProps> = (props) => {

    const budgets = useBudgetsIndex();
    const [selectedBudgets, setSelectedBudgets] = React.useState(new Set<string>());
    
    React.useEffect(() => {
        props.onTitleChange('Budget list');
    // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        function handleUnselectAll () {
            setSelectedBudgets(new Set());
        }

        if (selectedBudgets.size === 0) {
            props.onTitleChange('Budget list');
            props.onActions([ 
                <AddButton to={BudgetPath.add} key='add-budget'/>, 
                <ImportExportButton to={AppPaths.ImportExport} key='import-export-data'/>
            ]);
        } else {
            props.onTitleChange('Selecting budgets');
            props.onActions([
                <ButtonFab 
                    to={BudgetPath.pathCombinedWithQuery(selectedBudgets)}
                    disabled={selectedBudgets.size < 2} key='combine-budgets-button' >
                    <MergeIcon/>
                </ButtonFab>,
                <CloseButton onClick={handleUnselectAll} key='close-button'/>]);
        }
        return function () {
            props.onActions([]);
        };
    // eslint-disable-next-line
    }, [selectedBudgets]);

    function handleChanged (identifier: string, checked: boolean) {
        if (checked) {
            selectedBudgets.add(identifier);
        } else {
            selectedBudgets.delete(identifier);
        }
        setSelectedBudgets(new Set(selectedBudgets));
    }

    if (budgets === undefined) {
        return null;
    }
    if (budgets.length > 0) {
        return (
            <List>{
                budgets
                    .map(budget => <BudgetListItem 
                        key={`list-item-${budget.identifier}`} {...budget} 
                        onChanged={handleChanged} 
                        checked={selectedBudgets.has(budget.identifier)}/>)
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
