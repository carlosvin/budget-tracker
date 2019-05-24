import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../interfaces";
import { budgetsStore } from "../stores/BudgetsStore";

interface BudgetViewProps extends RouteComponentProps<{ id: string }>{}

interface BudgetViewState {
    info: Budget;
    expenses: {[timestamp: number]: Expense};
}

export class BudgetView extends React.PureComponent<BudgetViewProps, BudgetViewState> {

    constructor(props: BudgetViewProps){
        super(props);
        this.initBudget(props.match.params.id);
        this.initExpenses(props.match.params.id);
    }

    private async initBudget(identifier: string) {
        try {
            const info = await budgetsStore.getBudget(identifier);
            if (info) {
                this.setState({
                   ...this.state,
                   info 
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async initExpenses(identifier: string) {
        try {
            const expenses = await budgetsStore.getExpenses(identifier);
            if (expenses) {
                this.setState({
                    ...this.state,
                    expenses 
                 });
            }
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        if (this.state) {
            return (
                <Paper elevation={3} >

                { this.state.info && <Typography component="p">{this.state.info.name}</Typography>}
                { this.state.expenses && <Typography component="p">Expenses {Object.keys(this.state.expenses).map(k => `${k},`)}</Typography>}
                </Paper>

            );
        }
        return <CircularProgress/>;
        
    }
}