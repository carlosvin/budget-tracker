import * as React from "react";
import ListSubheader from '@material-ui/core/ListSubheader';
import './ExpenseListSubHeader.css';
import Grid from "@material-ui/core/Grid";
import { round } from "../../utils";

interface ExpenseListSubHeaderProps {
    totalSpent: number;
    expectedDailyAvg: number;
    date?: Date;
}

export const ExpenseListSubHeader: React.FC<ExpenseListSubHeaderProps> = (props) => {
    
    const {totalSpent, expectedDailyAvg, date} = props;
    const color = expectedDailyAvg < totalSpent ? 'subHeaderErr' : '';

    return (
        <ListSubheader id={`date-${date}`}>
            <Grid container direction='row' justify='space-between' >
                <Grid item>
                    {date && date.toDateString()}
                </Grid>
                <Grid item className={color}>
                    Total {round(totalSpent, 0)}
                </Grid>
            </Grid>
        </ListSubheader>);
}
