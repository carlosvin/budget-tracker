import * as React from "react";
import List from '@material-ui/core/List';
import { RouteComponentProps } from "react-router";
import { BudgetListItem } from "../../components/budgets/BudgetListItem";
import { HeaderNotifierProps } from "../../routes";
import { AddButton } from "../../components/buttons/AddButton";
import { ImportExportButton } from "../../components/buttons/ImportExportButton";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { AppPaths } from "../../domain/paths";
import AddIcon from '@material-ui/icons/Add';
import SyncIcon from '@material-ui/icons/Sync';
import { useBudgetsIndex } from "../../hooks/useBudgetsIndex";
import { CloseButton } from "../../components/buttons/CloseButton";
import MergeIcon from '@material-ui/icons/MergeType';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { ButtonFab } from "../../components/buttons/buttons";
import { useLoc } from "../../hooks/useLoc";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import ListSubheader from "@material-ui/core/ListSubheader";


interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

export const BudgetList: React.FC<BudgetListProps> = (props) => {

    const budgets = useBudgetsIndex();
    const [selectedBudgets, setSelectedBudgets] = React.useState(new Set<string>());
    const loc = useLoc();
    
    React.useEffect(() => {
        props.onTitleChange(loc('Budget list'));
    // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        function handleUnselectAll () {
            setSelectedBudgets(new Set());
        }

        if (selectedBudgets.size === 0) {
            props.onTitleChange(loc('Budget list'));
            props.onActions([ 
                <AddButton to={BudgetPath.add} key='add-budget'/>, 
                <ImportExportButton to={AppPaths.ImportExport} key='import-export-data'/>
            ]);
        } else {
            props.onTitleChange(loc('Selecting budgets'));
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
        const showCheckbox = budgets.length > 1;
        return (
            <List>{
                budgets
                    .map(budget => <BudgetListItem 
                        showCheckbox={showCheckbox}
                        key={`list-item-${budget.identifier}`} {...budget} 
                        onChanged={handleChanged} 
                        checked={selectedBudgets.has(budget.identifier)}/>)
            }
            </List>);
    } else {
        return <List subheader={
                    <ListSubheader component="div" id="no-budgets-header">
                        {loc('No budgets')}
                    </ListSubheader>}>
                    <OptionItem
                        primary={loc('Create new budget')} 
                        icon={<AddIcon/>}
                        path={BudgetPath.add} />
                    <OptionItem
                        primary={loc('Synchronize your account')} 
                        icon={<SyncIcon/>}
                        path={AppPaths.Sync} />
                    <OptionItem
                        primary={loc('Import from JSON')} 
                        icon={<ImportExportIcon/>}
                        path={AppPaths.ImportExport} />
                </List>;
                        path={AppPaths.ImportExport} history={props.history} />
                </List>
    }
}

interface OptionItemProps {
    primary: string;
    icon: React.ReactNode;
    path: string;
};

const OptionItem: React.FC<OptionItemProps> = (props) => (
    <ListItem component={Link} to={props.path} button>
        <ListItemAvatar>
            <Avatar>
            {props.icon}
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.primary}></ListItemText>
    </ListItem>
);
);

export default BudgetList;
