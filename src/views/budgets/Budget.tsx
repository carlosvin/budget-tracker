import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ExpenseList } from "../expenses/ExpenseList";
import { BudgetUrl } from "../../utils";
import { EditButton, DeleteButton, AddButton, DownloadButton } from "../../components/buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import { BudgetModel } from "../../BudgetModel";
import { BudgetQuickStats } from "../../components/BudgetQuickStats";
import { YesNoDialog } from "../../components/YesNoDialog";
import { btApp } from "../../BudgetTracker";

interface BudgetViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

interface BudgetViewState {
    totalSpent?: number;
    dailyAverage?: number;
    budgetModel?: BudgetModel;
    showConfirmDialog: boolean;
}

export default class BudgetView extends React.PureComponent<BudgetViewProps, BudgetViewState> {
    
    private readonly url: BudgetUrl;

    constructor(props: BudgetViewProps){
        super(props);
        this.state = { showConfirmDialog: false };
        this.url = new BudgetUrl(props.match.params.budgetId);
        this.init(props.match.params.budgetId);
    }

    private async init(budgetId: string) {
        const budgetModel = await btApp.budgetsStore.getBudgetModel(budgetId);
        this.props.onTitleChange(`${budgetModel.info.name} ${budgetModel.info.currency}`);
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

    private handleDeleteRequest = () => {
        this.setState({...this.state, showConfirmDialog: true} );
    }

    private handleExport = async () => {
        if (this.state.budgetModel){
            const categories = await btApp.categoriesStore.getCategories();
            const json = this.state.budgetModel.getJson(categories);
            window.open(
                'data:application/octet-stream,' +
                encodeURIComponent(json));
        }
    }

    private handleDelete = async (deletionConfirmed: boolean) => {
        if (this.state.budgetModel) {
            this.setState({...this.state, showConfirmDialog: false});
            if (deletionConfirmed) {
                await btApp.budgetsStore.deleteBudget(this.state.budgetModel.identifier);
                this.props.history.replace(BudgetUrl.base);
            }
        } else {
            throw new Error('Budget is undefined');
        }
    }

    componentDidMount(){
        this.props.onActions(
            <React.Fragment>
                <EditButton to={this.url.pathEdit}/>
                <DownloadButton onClick={this.handleExport}/>
                <DeleteButton onClick={this.handleDeleteRequest}/>
            </React.Fragment>
        );
    }

    componentWillUnmount(){
        this.props.onActions([]);
    }

    render() {
        const budgetModel = this.state.budgetModel;
        if (budgetModel) {
            return (
                <React.Fragment>
                    { budgetModel.expenses && 
                        <React.Fragment>
                            <BudgetQuickStats 
                                dailyAverage={this.state.dailyAverage}
                                expectedDailyAverage={budgetModel.expectedDailyExpensesAverage}
                                passedDays={budgetModel.days}
                                totalDays={budgetModel.totalDays}
                                totalBudget={budgetModel.info.total}
                                totalSpent={this.state.totalSpent || 0}
                                /> 
                            { budgetModel.expensesGroupedByDate && 
                            <ExpenseList 
                                expensesByDate={budgetModel.expensesGroupedByDate} 
                                budget={budgetModel.info}
                                expectedDailyAvg={budgetModel.expectedDailyExpensesAverage} /> }
                        </React.Fragment> 
                    } 
                    { budgetModel.numberOfExpenses === 0 && 
                        <Typography variant='h5' color='textSecondary'>There are no expenses</Typography> }
                    <AddButton href={this.url.pathAddExpense}/>
                    <YesNoDialog 
                        open={this.state.showConfirmDialog} 
                        onClose={this.handleDelete}
                        question='Do your really want to delete this budget?'
                        description='All the related expenses will be deleted.'/>
                </React.Fragment>
            );
        }
        return <CircularProgress/>;
    }
}
