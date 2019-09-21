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

    return <Grid>
        {budget && <GraphByCategory budget={budget} />}
        {budget && <GraphByCountry budget={budget}/>}
        {budget && <GraphDaysPerCountry budget={budget}/>}
        {budget && <GraphExpensesTimeLine budget={budget}/>}
    </Grid>;
}
