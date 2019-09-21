import * as React from "react";
import { GraphByCategory } from "./GraphByCategory";
import { GraphByCountry } from "./GraphByCountry";
import { GraphExpensesTimeLine } from "./GraphExpensesTimeLine";
import { GraphDaysPerCountry } from "./GraphDaysPerCountry";
import { BudgetModel } from "../../domain/BudgetModel";
import { Grid } from "@material-ui/core";

interface BudgetStatsProps {
    budget: BudgetModel;
}

export const BudgetStats: React.FC<BudgetStatsProps> = (props) => {
    const {budget} = props; 

    return <Grid container spacing={3}>
        {budget && <Grid item xs={12} sm={6}><GraphByCategory budget={budget} /></Grid>}
        {budget && <Grid item xs={12} sm={6}><GraphByCountry budget={budget}/></Grid>}
        {budget && <Grid item xs={12} sm={6}><GraphDaysPerCountry budget={budget}/></Grid>}
        {budget && <Grid item xs={12} sm={6}><GraphExpensesTimeLine budget={budget}/></Grid>}
    </Grid>;
}
