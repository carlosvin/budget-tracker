import * as React from "react";
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { Budget } from "../../interfaces";
import { Link } from 'react-router-dom';
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { dateDiff } from "../../domain/date";
import { ListItemSecondaryAction, Checkbox } from "@material-ui/core";

interface BudgetListItemProps extends Budget {
    onChanged: (identifier: string, checked: boolean) => void;
    checked?: boolean;
}

export const BudgetListItem: React.FC<BudgetListItemProps> = (props) => {
    const days = dateDiff(props.from, props.to);

    function handleToggle () {
        props.onChanged(props.identifier, !props.checked);
    }

    return (
        <ListItem
            button
            divider
            component={Link}
            to={new BudgetPath(props.identifier).path}>
            <ListItemText
                id={props.identifier}
                primary={props.name}
                secondary={
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        component="span"
                    >
                        <Typography component="span" color="textPrimary">
                            {`${days} days`}
                        </Typography>
                        <Typography component="span" color="textSecondary" align="right">
                            {`${props.total} ${props.currency}`}
                        </Typography>
                    </Grid>
                }
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle}
                checked={props.checked}
                inputProps={{ 'aria-labelledby': props.identifier }}
              />
            </ListItemSecondaryAction>

        </ListItem>
    );
}