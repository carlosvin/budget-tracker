import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from "../../routes";
import Typography from "@material-ui/core/Typography";
import { BudgetQuickStats } from "../../components/budgets/BudgetQuickStats";
import { YesNoDialog } from "../../components/YesNoDialog";
import { btApp } from "../../BudgetTracker";
import { ExpensesCalendar } from "../../components/expenses/ExpensesCalendar";
import { YMD } from "../../interfaces";
import { BudgetUrl } from "../../domain/BudgetUrl";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import MaterialIcon from "@material/react-material-icon";
import { FabButton } from "../../components/buttons";

interface BudgetViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const BudgetView: React.FC<BudgetViewProps> = (props) => {

    const {budgetId} = props.match.params;
    const {onActions, onTitleChange} = props;

    const url = new BudgetUrl(budgetId); 

    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [redirect, setRedirect] = React.useState<string>();

    const budgetModel = useBudgetModel(budgetId);

    React.useEffect(
        () => {
            if (budgetModel) {
                onTitleChange(`${budgetModel.info.name} ${budgetModel.info.currency}`);
            }
        },
    // eslint-disable-next-line
    [budgetModel]);

    React.useEffect(
        () => {
            async function handleExport() {
                if (budgetModel){
                    const store  = await btApp.getCategoriesStore();
                    const categories = await store.getCategories();
                    const json = budgetModel.getJson(categories);
                    window.open(
                        'data:application/octet-stream,' +
                        encodeURIComponent(json));
                }
            }

            function redirectToEdit () {
                setRedirect(url.pathEdit);
            }

            onActions([
                    <MaterialIcon icon='edit' aria-label='Edit budget' onClick={redirectToEdit}/>,
                    <MaterialIcon icon='download' aria-label='Download' onClick={handleExport}/>,
                    <MaterialIcon icon='delete' onClick={handleDeleteRequest}/>]
            );
            return () => onActions([]);
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
                const store = await btApp.getBudgetsStore()
                await store.deleteBudget(budgetModel.identifier);
                props.history.replace(BudgetUrl.base);
            }
        } else {
            throw new Error('Budget is undefined');
        }
    }

    if (redirect) {
        return <Redirect to={redirect}/>;
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
                <FabButton path={url.pathAddExpense} icon='add' onRedirect={setRedirect} />
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