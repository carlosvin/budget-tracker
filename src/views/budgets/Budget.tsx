import * as React from "react";
import { RouteComponentProps } from "react-router";
import { AppButton } from "../../components/buttons/buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import { BudgetModel } from "../../domain/BudgetModel";
import { BudgetQuickStats } from "../../components/budgets/BudgetQuickStats";
import { YesNoDialog } from "../../components/YesNoDialog";
import { btApp } from "../../BudgetTracker";
import { ExpensesCalendar } from "../../components/expenses/ExpensesCalendar";
import { YMD } from "../../interfaces";
import DownloadIcon from '@material-ui/icons/SaveAlt';
import EditIcon from '@material-ui/icons/Edit';
import { DeleteButton } from "../../components/buttons/DeleteButton";
import { AddButton } from "../../components/buttons/AddButton";
import { BudgetUrl } from "../../domain/BudgetUrl";

interface BudgetViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const BudgetView: React.FC<BudgetViewProps> = (props) => {

    const {budgetId} = props.match.params;
    const {onActions, onTitleChange} = props;

    const url = new BudgetUrl(budgetId); 

    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [budgetModel, setBudgetModel] = React.useState<BudgetModel>();

    React.useEffect(
        () => {
            async function init() {
                const budgetModel = await btApp.budgetsStore.getBudgetModel(budgetId);
                setBudgetModel(budgetModel);
                onTitleChange(`${budgetModel.info.name} ${budgetModel.info.currency}`);
            }
            init();
        },
    [budgetId, onTitleChange]);

    React.useEffect(
        () => {
            async function handleExport() {
                if (budgetModel){
                    const categories = await btApp.categoriesStore.getCategories();
                    const json = budgetModel.getJson(categories);
                    window.open(
                        'data:application/octet-stream,' +
                        encodeURIComponent(json));
                }
            }

            onActions(
                <React.Fragment>
                    <AppButton icon={EditIcon} aria-label='Edit budget' to={url.pathEdit}/>
                    <AppButton icon={DownloadIcon} aria-label='Download' onClick={handleExport}/>
                    <DeleteButton onClick={handleDeleteRequest}/>
                </React.Fragment>
            );
            return () => onActions(null);
        }
    ,[onActions, budgetModel, url.pathEdit]);
    
    function handleDeleteRequest () {
        setShowConfirmDialog(true);
    }

    function handleSelectedDay (date: YMD) {
        props.history.push(url.pathExpensesByDay(date));
    }

    async function handleDelete(deletionConfirmed: boolean) {
        if (budgetModel) {
            setShowConfirmDialog(false);
            if (deletionConfirmed) {
                await btApp.budgetsStore.deleteBudget(budgetModel.identifier);
                props.history.replace(BudgetUrl.base);
            }
        } else {
            throw new Error('Budget is undefined');
        }
    }

    if (budgetModel) {
        return (
            <React.Fragment>
                { budgetModel.expenses && 
                    <React.Fragment>
                        <BudgetQuickStats 
                            dailyAverage={budgetModel.average}
                            expectedDailyAverage={budgetModel.expectedDailyExpensesAverage}
                            passedDays={budgetModel.days}
                            totalDays={budgetModel.totalDays}
                            totalBudget={budgetModel.info.total}
                            totalSpent={budgetModel.totalExpenses}
                            urlStats={url.pathStats}
                            /> 
                        { budgetModel.expenseGroups && 
                        <ExpensesCalendar 
                            budgetModel={budgetModel} 
                            onDaySelected={handleSelectedDay} /> }
                    </React.Fragment> 
                } 
                { budgetModel.numberOfExpenses === 0 && 
                    <Typography variant='h5' color='textSecondary'>There are no expenses</Typography> }
                <AddButton to={url.pathAddExpense} />
                <YesNoDialog 
                    open={showConfirmDialog} 
                    onClose={handleDelete}
                    question='Do your really want to delete this budget?'
                    description='All the related expenses will be deleted.'/>
            </React.Fragment>
        );
    }
    return <CircularProgress/>;
}

export default BudgetView;