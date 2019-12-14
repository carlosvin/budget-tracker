import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { Budget } from "../../api";
import { Link } from 'react-router-dom';
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { dateDiff } from "../../domain/date";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Chip from "@material-ui/core/Chip";
import { getCurrencyWithSymbol } from "../../domain/utils/getCurrencyWithSymbol";
import { useLocalization } from "../../hooks/useLocalization";

interface BudgetListItemProps extends Budget {
    onChanged: (identifier: string, checked: boolean) => void;
    checked?: boolean;
    showCheckbox?: boolean;
}

export const BudgetListItem: React.FC<BudgetListItemProps> = (props) => {
    const { from, to, identifier, showCheckbox, onChanged, name, total, checked, currency } = props;
    const days = dateDiff(from, to);
    const idName = `li-name-${identifier}`;
    const isPassed = to < Date.now();
    const loc = useLocalization();

    function handleToggle() {
        onChanged(identifier, !checked);
    }

    return (
        <ListItem
            button
            divider
            component={Link}
            to={new BudgetPath(identifier).path}>

            <ListItemText
                id={idName}
                primary={name}
                secondary={`${days} ${loc.get('days')}`}
            />
            <ListItemText
                id={`li-info-${identifier}`}
                style={{ textAlign: 'right', marginRight: showCheckbox ? '1rem' : undefined }}
                primary={getCurrencyWithSymbol(total, currency)}
                secondary={<Chip 
                    component='span' 
                    label={isPassed ? loc.get('Old'): loc.get('Active')} 
                    size='small' 
                    disabled={isPassed}/>}
            />
            {showCheckbox && <ListItemSecondaryAction>
                <Checkbox
                    edge='end'
                    onChange={handleToggle}
                    checked={checked}
                    inputProps={{ 'aria-labelledby': idName }}
                    size='small'
                />
            </ListItemSecondaryAction>}

        </ListItem>
    );
}