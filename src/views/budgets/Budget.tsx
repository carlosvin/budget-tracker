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
import { currenciesStore } from "../../stores/CurrenciesStore";

interface BudgetViewProps extends RouteComponentProps<{ id: string }>{}

interface BudgetViewState {
    info: Budget;
    expenses: {[timestamp: number]: Expense};
    totalSpent?: number;
    averageSpent?: number;
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
                this.calculate();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async calculate() {
        const et = await this.getExpensesTotal();
        this.setState({
            ...this.state,
            totalSpent: Math.round(et),
            averageSpent: Math.round(this.getExpensesAverage(et))
        });
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
                                <Grid container direction='row' justify='space-between'>
                                <Typography variant="h5" component="h2">
                                    {this.state.info.name}
                                </Typography>
                                <Typography color='textSecondary'>
                                    {this.state.info.currency}
                                </Typography>
                                </Grid>
                                
                                <GridList cellHeight={110} cols={2} >
                                    <GridListTile key='total' >
                                        <InfoField label='Total' value={this.total}/>
                                    </GridListTile>
                                    <GridListTile key='Spent'>
                                        <InfoField label='Spent' value={this.state.totalSpent}/>
                                    </GridListTile>
                                    <GridListTile key='average'>
                                        <InfoField label='Average' value={this.state.averageSpent}/>
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

    get total () {
        return `${this.state.info.total}`;
    }

    async convertToBaseCurrency(expense: Expense){
        if (expense.currency === this.state.info.currency) {
            return expense.amount;
        }
        const rate = await currenciesStore.getRate(
            this.state.info.currency, 
            expense.currency);
        return expense.amount / rate;
    }

    async getExpensesTotal () {
        if (this.state.expenses) {
            const values = Object.values(this.state.expenses);
            if (values.length > 0) {
                let total = 0;
                for (const expense of values) {
                    total = total + await this.convertToBaseCurrency(expense);
                }
                return total;
            }
        }
        return 0;
    }

    private getExpensesAverage (totalSpent: number) {
        const days = this.pastDays;
        if (days > 0) {
            return totalSpent > 0 ? Math.round(totalSpent / days) : 0;
        } else {
            return undefined;
        }
    }

    get pastDays () {
        return dateDiff(this.state.info.from, new Date().getTime());
    }
}