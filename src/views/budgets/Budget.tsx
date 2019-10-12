import * as React from "react";
import { RouteComponentProps } from "react-router";
import { AppButton } from "../../components/buttons/buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";
import { BudgetQuickStats } from "../../components/budgets/BudgetQuickStats";
import { YesNoDialog } from "../../components/YesNoDialog";
import { ExpensesCalendar } from "../../components/expenses/ExpensesCalendar";
import { YMD } from "../../api";
import EditIcon from '@material-ui/icons/Edit';
import { DeleteButton } from "../../components/buttons/DeleteButton";
import { AddButton } from "../../components/buttons/AddButton";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { ImportExportButton } from "../../components/buttons/ImportExportButton";
import { HeaderNotifierProps } from "../../routes";
import { useAppContext } from "../../contexts/AppContext";
import { useLoc } from "../../hooks/useLoc";
import { useHeaderContext } from "../../hooks/useHeaderContext";

interface BudgetViewProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps {}

export const BudgetView: React.FC<BudgetViewProps> = (props) => {

    const {budgetId} = props.match.params;
    const {onTitleChange} = props;

    const url = new BudgetPath(budgetId);

    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

    const budgetModel = useBudgetModel(budgetId);
    
    const btApp = useAppContext();
    const loc = useLoc();

    React.useEffect(() => {
        budgetModel && onTitleChange(budgetModel.name);
    },
    // eslint-disable-next-line
    [budgetModel]);

    function handleDeleteRequest () {
        setShowConfirmDialog(true);
    }

    useHeaderContext('...', [
        <AppButton key='cb-edit-budget' icon={EditIcon} aria-label={loc('Edit budget')} to={url.pathEdit}/>,
        <ImportExportButton key='cb-export-budget' to={url.pathExport}/>,
        <DeleteButton onClick={handleDeleteRequest} key='cb-delete-budget'/>
    ], props);

    function handleSelectedDay (date: YMD) {
        const {year, month, day} = date;
        props.history.push(url.pathExpensesByDay(year, month, day));
    }

    async function handleDelete(deletionConfirmed: boolean) {
        if (budgetModel) {
            setShowConfirmDialog(false);
            if (deletionConfirmed) {
                const store = await btApp.getBudgetsStore()
                await store.deleteBudget(budgetModel.identifier);
                props.history.replace(BudgetPath.base);
            }
        } else {
            throw new Error('Budget is undefined');
        }
    }

    if (budgetModel) {
        return (
            <React.Fragment>
                <React.Fragment>
                    <BudgetQuickStats 
                        dailyAverage={budgetModel.average}
                        expectedDailyAverage={budgetModel.expectedDailyExpensesAverage}
                        passedDays={budgetModel.daysUntilToday}
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
                { budgetModel.numberOfExpenses === 0 && 
                    <Typography variant='h5' color='textSecondary'>{loc('No expenses')}</Typography> }
                <AddButton to={url.pathAddExpense} />
                <YesNoDialog 
                    open={showConfirmDialog} 
                    onClose={handleDelete}
                    question={loc('Delete budget?')}
                    description={loc('Expenses will be deleted')}/>
            </React.Fragment>
        );
    }
    return <CircularProgress/>;
}

export default BudgetView;
