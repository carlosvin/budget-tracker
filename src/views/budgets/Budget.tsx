import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import { ExpenseList } from "../expenses/ExpenseList";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import { dateDiff, BudgetUrl } from "../../utils";
import Grid from "@material-ui/core/Grid";
import { AddButton, EditButton } from "../buttons";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { InfoField } from "../InfoField";

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
                                <GridList cellHeight={110} cols={2} >
                                    <GridListTile key='total' >
                                        <InfoField label='Total' value={this.state.info.total}/>
                                    </GridListTile>
                                    <GridListTile key='Spent'>
                                        <InfoField label='Spent' value={this.expensesTotal}/>
                                    </GridListTile>
                                    <GridListTile key='average'>
                                        <InfoField label='Average' value={this.expensesAverage}/>
                                    </GridListTile>
                                    <GridListTile key='days'>
                                        <InfoField label='Days' value={this.pastDays}/>
                                    </GridListTile>
                                </GridList>
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
            const values = Object.values(this.state.expenses);
            if (values.length > 0) {
                return Object.values(this.state.expenses)
                    .map(e => e.amount)
                    .reduce((total, num) => total + num);
            }
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