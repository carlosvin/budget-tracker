import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import SyncIcon from '@material-ui/icons/Sync';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Link } from "react-router-dom";
import { BudgetPath } from '../../domain/paths/BudgetPath';
import { AppPaths } from '../../domain/paths';
import { LocalizationApi } from '../../services';

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
    </ListItem>);


export function BudgetsListEmpty({loc}: {loc: LocalizationApi}) {
    return <List subheader={
        <ListSubheader component="div" id="no-budgets-header">
            {loc.get('No budgets')}
        </ListSubheader>}>
        <OptionItem
            primary={loc.get('Create new budget')} 
            icon={<AddIcon/>}
            path={BudgetPath.add} />
        <OptionItem
            primary={loc.get('Synchronize your account')} 
            icon={<SyncIcon/>}
            path={AppPaths.Sync} />
        <OptionItem
            primary={loc.get('Import from JSON')} 
            icon={<ImportExportIcon/>}
            path={AppPaths.ImportExport} />
    </List>;
}

