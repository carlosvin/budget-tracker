import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../interfaces";
import { budgetsStore } from "../BudgetsStore";

interface ExpenseViewProps extends RouteComponentProps<{ id: string, timestamp: string }>{}

interface ExpenseViewState {
    expense: Expense;
    budget: Budget;
}

export class ExpenseView extends React.PureComponent<ExpenseViewProps, ExpenseViewState> {

    constructor(props: ExpenseViewProps){
        super(props);
        this.initExpense(
            props.match.params.id, 
            +props.match.params.timestamp);
    }

    private async initExpense(identifier: string, timestamp: number) {
        try {
            const expense = await budgetsStore.getExpense(identifier, timestamp);
            if (expense) {
                this.setState({
                    ...this.state,
                    expense 
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
                    { this.state.budget && <Typography component="p">{this.state.budget.name}</Typography> }
                </Paper>

            );
        }
        return <CircularProgress/>;
        
    }
}