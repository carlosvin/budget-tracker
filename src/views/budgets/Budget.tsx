import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget, Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import { ExpenseList } from "../expenses/ExpenseList";
import { dateDiff, BudgetUrl } from "../../utils";
import { EditButton, DeleteButton, AddButton } from "../../components/buttons";
import { currenciesStore } from "../../stores/CurrenciesStore";
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import { VersusInfo } from "../../components/VersusInfo";

interface BudgetViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

interface BudgetViewState {
    info: Budget;
    expenses: {[timestamp: number]: Expense};
    totalSpent?: number;
    averageSpent?: number;
}

export default class BudgetView extends React.PureComponent<BudgetViewProps, BudgetViewState> {
    
    private readonly url: BudgetUrl;

    constructor(props: BudgetViewProps){
        super(props);
        this.initBudget(props.match.params.budgetId);
        this.initExpenses(props.match.params.budgetId);
        this.url = new BudgetUrl(props.match.params.budgetId);
    }

    private async initBudget(identifier: string) {
        try {
            const info = await budgetsStore.getBudget(identifier);
            if (info) {
                this.setState({
                    ...this.state,
                    info 
                });
                this.props.onTitleChange(`${info.name} ${info.currency}`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async initExpenses(identifier: string) {
        try {
            const expenses = await budgetsStore.getExpenses(identifier) || {};
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
            totalSpent: et && Math.round(et),
            averageSpent: et && this.getExpensesAverage(et)
        });
    }

    private handleDelete = () => {
        budgetsStore.deleteBudget(this.state.info.identifier);
        this.props.history.replace(BudgetUrl.base);
    }

    get expectedDailyExpensesAverage () {
        return Math.round(this.state.info.total / this.totalDays);
    }

    componentDidMount(){
        this.props.onActions(
            <React.Fragment>
                <EditButton href={this.url.pathEdit}/>
                <DeleteButton onClick={this.handleDelete}/>
            </React.Fragment>
        );
    }

    componentWillUnmount(){
        this.props.onActions([]);
    }

    render() {
        if (this.state && this.state.info) {
            return (
                <React.Fragment>
                    { this.state.expenses && 
                        <React.Fragment>
                            <this.Stats/> 
                            <ExpenseList expenses={this.state.expenses} budget={this.state.info}/>
                        </React.Fragment> } 
                    { !this.state.totalSpent && <Typography variant='h5' color='textSecondary'>There are no expenses</Typography> }
                    <AddButton href={this.url.pathAddExpense}/>
                </React.Fragment>
            );
        }
        return <CircularProgress/>;
    }

    private Stats = () => (
        <GridList cellHeight={50} cols={2} >
            <GridListTile key='total' cols={2}>
                <VersusInfo 
                    total={this.state.info.total}
                    spent={this.state.totalSpent || 0}
                    title='Spent'/>
            </GridListTile>
            <GridListTile key='days' cols={2}>
                <VersusInfo 
                    total={this.totalDays}
                    spent={this.pastDays} 
                    title='Days'/>
            </GridListTile>
            { this.state.averageSpent && <GridListTile key='average' cols={2}>
                <VersusInfo 
                    total={this.expectedDailyExpensesAverage} 
                    spent={this.state.averageSpent}
                    title='Daily Average'/>
            </GridListTile> }
        </GridList>);

    async getExpensesTotal () {
        if (this.state.expenses && this.state.info) {
            const values = Object.values(this.state.expenses);
            if (values.length > 0) {
                let total = 0;
                for (const expense of values) {
                    if (expense.amountBaseCurrency !== undefined) {
                        total = total + expense.amountBaseCurrency;
                    } else {
                        total = total + await this.getAmountInBaseCurrency(expense);
                    }
                }
                return total;
            }
        }
        return 0;
    }

    private async getAmountInBaseCurrency(expense: Expense): Promise<number> {
        try {
            return await currenciesStore.getAmountInBaseCurrency(
                this.state.info.currency, 
                expense.currency, 
                expense.amount);
        } catch (err) {
            console.warn('Could not get rate: ', err);
            return 0;
        }
    }

    private getExpensesAverage (totalSpent: number) {
        const days = this.pastDays;
        if (days > 0) {
            return totalSpent > 0 ? Math.round(totalSpent / days) : 0;
        } else {
            return 0;
        }
    }

    get pastDays () {
        return dateDiff(this.state.info.from, new Date().getTime());
    }

    get totalDays () {
        return dateDiff(this.state.info.from, this.state.info.to);
    }
}