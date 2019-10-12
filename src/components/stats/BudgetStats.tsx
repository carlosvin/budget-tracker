import * as React from "react";
import { GraphByCategory } from "./GraphByCategory";
import { GraphByCountry } from "./GraphByCountry";
import { GraphExpensesTimeLine } from "./GraphExpensesTimeLine";
import { GraphDaysPerCountry } from "./GraphDaysPerCountry";
import { BudgetModel } from "../../domain/BudgetModel";
import Grid from "@material-ui/core/Grid";
import { GraphDailyAverageByCountry } from "./GraphDailyAverageByCountry";
import { CategoriesMap } from "../../api";

interface BudgetStatsComponentProps {
    budget: BudgetModel;
    categories?: CategoriesMap;
}

export const BudgetStatsComponents: React.FC<BudgetStatsComponentProps> = (props) => {
    const {budget, categories} = props;

    return <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>{categories && <GraphByCategory budget={budget} categories={categories} />}</Grid>
        <Grid item xs={12} sm={6}><GraphDailyAverageByCountry budget={budget}/></Grid>
        <Grid item xs={12} sm={6}><GraphByCountry budget={budget}/></Grid>
        <Grid item xs={12} sm={6}><GraphDaysPerCountry budget={budget}/></Grid>
        <Grid item xs={12} sm={6}><GraphExpensesTimeLine budget={budget}/></Grid>
    </Grid>;
}
