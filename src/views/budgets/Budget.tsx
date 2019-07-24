import * as React from "react";
import { RouteComponentProps } from "react-router";
import { BudgetUrl } from "../../utils";
import { AppButton } from "../../components/buttons/buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import { BudgetModel } from "../../BudgetModel";
import { BudgetQuickStats } from "../../components/budgets/BudgetQuickStats";
import { YesNoDialog } from "../../components/YesNoDialog";
import { btApp } from "../../BudgetTracker";
import { ExpensesCalendar } from "../../components/expenses/ExpensesCalendar";
import { YMD } from "../../interfaces";
import DownloadIcon from '@material-ui/icons/SaveAlt';
import EditIcon from '@material-ui/icons/Edit';
import { DeleteButton } from "../../components/buttons/DeleteButton";
import { AddButton } from "../../components/buttons/AddButton";

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
            totalSpent: budgetModel.totalExpenses,
            dailyAverage: budgetModel.average,
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

    private handleSelectedDay = (date: YMD) => {
        this.props.history.push(this.url.pathExpensesByDay(date));
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
                <AppButton icon={EditIcon} aria-label='Edit budget' to={this.url.pathEdit}/>
                <AppButton icon={DownloadIcon} aria-label='Download' onClick={this.handleExport}/>
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
                            { budgetModel.expenseGroups && 
                            <ExpensesCalendar 
                                budgetModel={budgetModel} 
                                onDaySelected={this.handleSelectedDay} /> }
                        </React.Fragment> 
                    } 
                    { budgetModel.numberOfExpenses === 0 && 
                        <Typography variant='h5' color='textSecondary'>There are no expenses</Typography> }
                    <AddButton href={this.url.pathAddExpense} />
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
