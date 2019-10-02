import * as React from "react";
import { GraphByCategory } from "./GraphByCategory";
import { GraphByCountry } from "./GraphByCountry";
import { GraphExpensesTimeLine } from "./GraphExpensesTimeLine";
import { GraphDaysPerCountry } from "./GraphDaysPerCountry";
import { BudgetModel } from "../../domain/BudgetModel";
import Grid from "@material-ui/core/Grid";
import { GraphDailyAverageByCountry } from "./GraphDailyAverageByCountry";

interface BudgetStatsComponentProps {
    budget: BudgetModel;
}

export const BudgetStatsComponents: React.FC<BudgetStatsComponentProps> = (props) => {
    const {budget} = props;

    return <Grid container spacing={3}>
        <Grid item xs={12} sm={6}><GraphByCategory budget={budget} /></Grid>
        <Grid item xs={12} sm={6}><GraphDailyAverageByCountry budget={budget}/></Grid>
        <Grid item xs={12} sm={6}><GraphByCountry budget={budget}/></Grid>
        <Grid item xs={12} sm={6}><GraphDaysPerCountry budget={budget}/></Grid>
        <Grid item xs={12} sm={6}><GraphExpensesTimeLine budget={budget}/></Grid>
    </Grid>;
}
