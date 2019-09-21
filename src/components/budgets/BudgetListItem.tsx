import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { Budget } from "../../interfaces";
import { Link } from 'react-router-dom';
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { dateDiff } from "../../domain/date";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

interface BudgetListItemProps extends Budget {
    onChanged: (identifier: string, checked: boolean) => void;
    checked?: boolean;
}

export const BudgetListItem: React.FC<BudgetListItemProps> = (props) => {
    const days = dateDiff(props.from, props.to);
    const idName = `li-name-${props.identifier}`;

    function handleToggle() {
        props.onChanged(props.identifier, !props.checked);
    }

    return (
        <ListItem
            button
            divider
            component={Link}
            to={new BudgetPath(props.identifier).path}>

            <ListItemText
                id={idName}
                primary={props.name}
                secondary={`${days} days`}
            />
            <ListItemText
                id={`li-info-${props.identifier}`}
                style={{ textAlign: 'right' }}
                primary={props.total}
                secondary={props.currency}
            />
            <ListItemSecondaryAction>
                <Checkbox
                    edge='end'
                    onChange={handleToggle}
                    checked={props.checked}
                    inputProps={{ 'aria-labelledby': idName }}
                    size='small'
                />
            </ListItemSecondaryAction>

        </ListItem>
    );
}