import * as React from "react";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../interfaces";
import { budgetsStore } from "../stores/BudgetsStore";
import { ExpenseList } from "./ExpenseList";
import { Card, CardContent, CardActions, Button, Grid, Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core";
import { dateDiff } from "../utils";

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
                <React.Fragment>
                    { this.state.info && 
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                {this.state.info.name}
                                </Typography>
                                <Table>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Spent</TableCell>
                                        <TableCell>Average</TableCell>
                                        <TableCell>Days</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={1}>
                                        <TableCell>{this.state.info.total}</TableCell>
                                        <TableCell>{this.expensesTotal}</TableCell>
                                        <TableCell>{this.expensesAverage}</TableCell>
                                        <TableCell>{this.pastDays}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    }

                    { this.state.expenses && <ExpenseList expenses={this.state.expenses} budget={this.state.info}/> }
                </React.Fragment>

            );
        }
        return <CircularProgress/>;
        
    }

    get expensesTotal () {
        if (this.state.expenses) {
            return Object.values(this.state.expenses)
                .map(e => e.amount)
                .reduce((total, num) => total + num);
        }
        return 0;
    }

    get expensesAverage () {
        return Math.round(this.expensesTotal / this.pastDays);
    }

    get pastDays () {
        return dateDiff(this.state.info.from, new Date());
    }
}