import * as React from "react";
import { RouteComponentProps } from "react-router";
import { budgetsStore } from "../../stores/BudgetsStore";
import { ExpenseList } from "../expenses/ExpenseList";
import { BudgetUrl } from "../../utils";
import { EditButton, DeleteButton, AddButton } from "../../components/buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import { VersusInfo } from "../../components/VersusInfo";
import { BudgetModel } from "../../BudgetModel";

interface BudgetViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

interface BudgetViewState {
    totalSpent?: number;
    dailyAverage?: number;
    budgetModel?: BudgetModel;
}

export default class BudgetView extends React.PureComponent<BudgetViewProps, BudgetViewState> {
    
    private readonly url: BudgetUrl;

    constructor(props: BudgetViewProps){
        super(props);
        this.state = {};
        this.url = new BudgetUrl(props.match.params.budgetId);
        this.init(props.match.params.budgetId);
    }

    private async init(budgetId: string) {
        const [info, expenses] = await Promise.all([
            this.initBudget(budgetId), 
            this.initExpenses(budgetId)]);
        this.props.onTitleChange(`${info.name} ${info.currency}`);
        const budgetModel = new BudgetModel(info, expenses);

        this.setState({
            ...this.state,
            budgetModel
        });
        this.setState({
            ...this.state,
            totalSpent: await budgetModel.getTotalExpenses(),
            dailyAverage: await budgetModel.getAverage(),
        });
    }

    private async initBudget(identifier: string) {
        const info = await budgetsStore.getBudget(identifier);
        if (info) {
            return info;
        }
        throw new Error('Is not possible to load budget: ' + identifier);
    }

    private async initExpenses(identifier: string) {
        const expenses = await budgetsStore.getExpenses(identifier) || {};
        if (expenses) {
            return expenses;
        }
        throw new Error('Is not possible to load expenses for budget: ' + identifier);
    }

    private handleDelete = () => {
        if (this.state.budgetModel) {
            budgetsStore.deleteBudget(this.state.budgetModel.identifier);
            this.props.history.replace(BudgetUrl.base);
        } else {
            throw new Error('Budget is undefined');
        }
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
        if (this.state.budgetModel) {
            const budgetModel = this.state.budgetModel;
            return (
                <React.Fragment>
                    { this.state.budgetModel.expenses && 
                        <React.Fragment>
                            <this.Stats 
                                dailyAverage={this.state.dailyAverage}
                                expectedDailyAverage={budgetModel.expectedDailyExpensesAverage}
                                passedDays={budgetModel.days}
                                totalDays={budgetModel.totalDays}
                                totalBudget={budgetModel.info.total}
                                totalSpent={this.state.totalSpent || 0}
                                /> 
                            <ExpenseList 
                                expenses={this.state.budgetModel.expenses} 
                                budget={this.state.budgetModel.info}
                                expectedDailyAvg={this.state.budgetModel.expectedDailyExpensesAverage} />
                        </React.Fragment> 
                    } 
                    { this.state.budgetModel.numberOfExpenses === 0 && 
                        <Typography variant='h5' color='textSecondary'>There are no expenses</Typography> }
                    <AddButton href={this.url.pathAddExpense}/>
                </React.Fragment>
            );
        }
        return <CircularProgress/>;
    }

    private Stats = (props: {
        totalBudget: number,
        totalSpent: number,
        totalDays: number,
        passedDays: number,
        expectedDailyAverage: number,
        dailyAverage?: number
    }) => (
        <GridList cellHeight={50} cols={2} >
            <GridListTile key='total' cols={2}>
                <VersusInfo 
                    total={props.totalBudget}
                    spent={props.totalSpent}
                    title='Spent'/>
            </GridListTile>
            <GridListTile key='days' cols={2}>
                <VersusInfo 
                    total={props.totalDays}
                    spent={props.passedDays} 
                    title='Days'/>
            </GridListTile>
            { props.dailyAverage !== undefined && <GridListTile key='average' cols={2}>
                <VersusInfo 
                    total={props.expectedDailyAverage} 
                    spent={props.dailyAverage}
                    title='Daily Average'/>
            </GridListTile> }
        </GridList>);

}