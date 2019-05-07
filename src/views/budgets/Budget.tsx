import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import { ExpenseList } from "../expenses/ExpenseList";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import { dateDiff, BudgetUrl } from "../../utils";
import { Grid } from "@material-ui/core";
import { AddButton, EditButton } from "../buttons";

interface BudgetViewProps extends RouteComponentProps<{ id: string }>{}

interface BudgetViewState {
    info: Budget;
    expenses: {[timestamp: number]: Expense};
}

export class BudgetView extends React.PureComponent<BudgetViewProps, BudgetViewState> {
    
    private readonly url: BudgetUrl;

    constructor(props: BudgetViewProps){
        super(props);
        this.initBudget(props.match.params.id);
        this.initExpenses(props.match.params.id);
        this.url = new BudgetUrl(props.match.params.id);
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

    private Actions = () => (
        <Grid container justify='space-between'>
            <EditButton href={this.url.pathEdit}/>
            <AddButton href={this.url.pathAddExpense}/>
        </Grid>
    );

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
                                <this.Actions />
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
        const total = this.expensesTotal;
        const days = this.pastDays;
        if (days > 0) {
            return total > 0 ? Math.round(total / days) : 0;
        } else {
            return '-';
        }
    }

    get pastDays () {
        return dateDiff(this.state.info.from, new Date().getTime());
    }
}